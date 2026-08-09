/**
 * OpenRouter API Key Manager
 * Handles intelligent key rotation and fallback logic
 */

interface KeyStatus {
  key: string;
  name: string;
  isAvailable: boolean;
  lastChecked: number;
  credits?: number;
  rateLimitRemaining?: number;
  error?: string;
}

interface KeyUsageCache {
  [keyName: string]: KeyStatus;
}

// In-memory cache for key status (resets on serverless function restart)
const keyStatusCache: KeyUsageCache = {};
const CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

// Round-robin counter for per-request rotation (better load distribution)
let requestCounter = 0;

/**
 * Get all available API keys from environment
 * Supports both process.env (local) and Cloudflare Workers env binding
 */
function getAllKeys(env?: Record<string, string | undefined>): Array<{ name: string; key: string }> {
  // OPENROUTER_API_0 is the pinned default (primary) key — always tried first when set.
  const primaryKey = env?.OPENROUTER_API_0 || process.env.OPENROUTER_API_0;
  const defaultKey = env?.OPENROUTER_API || process.env.OPENROUTER_API;
  const keyOne = env?.OPENROUTER_API_1 || process.env.OPENROUTER_API_1;
  const keyTwo = env?.OPENROUTER_API_2 || process.env.OPENROUTER_API_2;

  // Fallback keys, used only when the primary is unavailable.
  const fallbackKeys: Array<{ name: string; key: string }> = [];
  if (defaultKey) fallbackKeys.push({ name: 'openrouter-default', key: defaultKey });
  if (keyOne) fallbackKeys.push({ name: 'openrouter-one', key: keyOne });
  if (keyTwo) fallbackKeys.push({ name: 'openrouter-two', key: keyTwo });

  // Round-robin rotation across the fallback keys for load distribution.
  if (fallbackKeys.length > 1) {
    requestCounter++;
    const rotationIndex = requestCounter % fallbackKeys.length;
    for (let i = 0; i < rotationIndex; i++) {
      const first = fallbackKeys.shift();
      if (first) fallbackKeys.push(first);
    }
  }

  // Assemble: primary (default) first, then rotated fallbacks.
  const availableKeys: Array<{ name: string; key: string }> = [];
  if (primaryKey) availableKeys.push({ name: 'openrouter-0', key: primaryKey });
  availableKeys.push(...fallbackKeys);

  if (availableKeys.length === 0) {
    console.error('[KeyManager] No API keys configured');
    return [];
  }

  console.log(`[KeyManager] Default: ${availableKeys[0]?.name}, fallbacks: [${availableKeys.slice(1).map(k => k.name).join(', ')}] (request #${requestCounter})`);
  console.log(`[KeyManager] Total keys configured: ${availableKeys.length}`);

  return availableKeys;
}

/**
 * Check if cached status is still valid
 */
function isCacheValid(lastChecked: number): boolean {
  return Date.now() - lastChecked < CACHE_DURATION;
}

/**
 * Check key credits and availability via OpenRouter API
 */
async function checkKeyCredits(apiKey: string): Promise<{
  credits: number;
  rateLimitRemaining: number;
  isAvailable: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/key', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return {
        credits: 0,
        rateLimitRemaining: 0,
        isAvailable: false,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      credits: data.limit || 0,
      rateLimitRemaining: data.rate_limit?.remaining || 100,
      isAvailable: true,
    };
  } catch (error) {
    return {
      credits: 0,
      rateLimitRemaining: 0,
      isAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get the best available API key based on current status
 * Pass env from Cloudflare Workers binding, or leave undefined for process.env
 */
export async function getBestAvailableKey(env?: Record<string, string | undefined>): Promise<{
  key: string;
  name: string;
} | null> {
  const allKeys = getAllKeys(env);

  if (allKeys.length === 0) {
    console.error('[KeyManager] No API keys configured');
    return null;
  }

  // Track first available key as fallback
  let fallbackKey: { name: string; key: string } | null = null;

  // Check each key's status
  for (const { name, key } of allKeys) {
    // Store first key as fallback
    if (!fallbackKey) {
      fallbackKey = { name, key };
    }

    const cached = keyStatusCache[name];

    // Skip if explicitly marked as failed recently (rate limited)
    if (cached && isCacheValid(cached.lastChecked) && !cached.isAvailable && cached.error?.includes('rate limit')) {
      console.log(`[KeyManager] Skipping ${name} (rate limited: ${cached.error})`);
      continue;
    }

    // Use cached status if valid and healthy
    if (cached && isCacheValid(cached.lastChecked) && cached.isAvailable) {
      console.log(`[KeyManager] Using cached ${name} (healthy)`);
      return { key, name };
    }

    // Check key status if cache is stale or unavailable (non-blocking, best-effort)
    console.log(`[KeyManager] Checking ${name} status...`);
    const status = await checkKeyCredits(key);

    // Update cache
    keyStatusCache[name] = {
      key,
      name,
      isAvailable: status.isAvailable,
      lastChecked: Date.now(),
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      error: status.error,
    };

    // Return if credit check succeeded
    if (status.isAvailable && status.rateLimitRemaining > 0) {
      console.log(`[KeyManager] ✓ Selected ${name} (${status.rateLimitRemaining} requests remaining)`);
      return { key, name };
    } else if (status.rateLimitRemaining === 0) {
      console.warn(`[KeyManager] ${name} rate limited, trying next key`);
      continue;
    } else {
      // Credit check failed but not rate limited - use it anyway
      console.warn(`[KeyManager] ${name} credit check failed (${status.error}), but using it anyway (optimistic)`);
      return { key, name };
    }
  }

  // If all checks failed, use fallback (first available key)
  if (fallbackKey) {
    console.warn(`[KeyManager] All credit checks failed, using fallback key: ${fallbackKey.name}`);
    return fallbackKey;
  }

  console.error('[KeyManager] No API keys configured');
  return null;
}

/**
 * Mark a key as failed (for immediate rotation)
 */
export function markKeyAsFailed(keyName: string, error: string): void {
  if (keyStatusCache[keyName]) {
    keyStatusCache[keyName].isAvailable = false;
    keyStatusCache[keyName].error = error;
    keyStatusCache[keyName].lastChecked = Date.now();
    console.log(`[KeyManager] Marked ${keyName} key as failed: ${error}`);
  }
}

/**
 * Get status of all keys for monitoring
 */
export function getAllKeyStatus(): KeyUsageCache {
  return keyStatusCache;
}

/**
 * Check if any cached key status is stale (older than CACHE_DURATION)
 */
export function isCacheStale(): boolean {
  const keys = Object.values(keyStatusCache);
  if (keys.length === 0) return true;

  // Check if any key is older than cache duration
  return keys.some(status => Date.now() - status.lastChecked > CACHE_DURATION);
}

/**
 * Force refresh all key statuses
 * Pass env from Cloudflare Workers binding, or leave undefined for process.env
 */
export async function refreshAllKeyStatus(env?: Record<string, string | undefined>): Promise<void> {
  const allKeys = getAllKeys(env);

  for (const { name, key } of allKeys) {
    const status = await checkKeyCredits(key);

    keyStatusCache[name] = {
      key,
      name,
      isAvailable: status.isAvailable,
      lastChecked: Date.now(),
      credits: status.credits,
      rateLimitRemaining: status.rateLimitRemaining,
      error: status.error,
    };
  }

  console.log('[KeyManager] Refreshed all key statuses:', keyStatusCache);
}
