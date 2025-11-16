/**
 * Platform Detection Utility
 * Detects the runtime environment to enable platform-specific features
 */

export interface PlatformCapabilities {
  platform: 'cloudflare' | 'vercel' | 'nodejs' | 'edge' | 'unknown';
  hasNodeAPIs: boolean;
  hasPlaywright: boolean;
  hasD1Database: boolean;
  isEdgeRuntime: boolean;
}

/**
 * Detect current platform and available capabilities
 */
export function detectPlatform(): PlatformCapabilities {
  const capabilities: PlatformCapabilities = {
    platform: 'unknown',
    hasNodeAPIs: false,
    hasPlaywright: false,
    hasD1Database: false,
    isEdgeRuntime: false,
  };

  // Check for Cloudflare Workers environment
  if (typeof globalThis !== 'undefined') {
    // Cloudflare Workers has special global bindings
    if ((globalThis as any).caches || (globalThis as any).EdgeRuntime) {
      capabilities.platform = 'cloudflare';
      capabilities.isEdgeRuntime = true;
    }
  }

  // Check for Vercel Edge Runtime
  if (typeof process !== 'undefined' && process.env?.NEXT_RUNTIME === 'edge') {
    capabilities.platform = 'edge';
    capabilities.isEdgeRuntime = true;
  }

  // Check for Vercel Node.js Runtime
  if (typeof process !== 'undefined' && process.env?.VERCEL && process.env?.NEXT_RUNTIME !== 'edge') {
    capabilities.platform = 'vercel';
  }

  // Check for Node.js APIs availability
  try {
    // Try to access Node.js-specific modules
    if (typeof process !== 'undefined' &&
        typeof process.version === 'string' &&
        typeof require !== 'undefined') {
      capabilities.hasNodeAPIs = true;

      if (capabilities.platform === 'unknown') {
        capabilities.platform = 'nodejs';
      }
    }
  } catch {
    // Node.js APIs not available
  }

  // Check if Playwright is available (requires Node.js APIs)
  if (capabilities.hasNodeAPIs) {
    try {
      // Check if playwright dependencies are loadable
      // We don't actually import it here to avoid loading it unnecessarily
      capabilities.hasPlaywright = true;
    } catch {
      capabilities.hasPlaywright = false;
    }
  }

  // Check for D1 Database binding (Cloudflare-specific)
  if (
    (typeof globalThis !== 'undefined' && (globalThis as any).DB) ||
    (typeof process !== 'undefined' && (process.env as any).DB)
  ) {
    capabilities.hasD1Database = true;
  }

  return capabilities;
}

/**
 * Check if we're running in a Node.js environment with full APIs
 */
export function hasNodeJSRuntime(): boolean {
  try {
    return typeof process !== 'undefined' &&
           typeof process.version === 'string' &&
           process.env?.NEXT_RUNTIME !== 'edge';
  } catch {
    return false;
  }
}

/**
 * Check if we're running in an Edge Runtime (Cloudflare or Vercel Edge)
 */
export function isEdgeRuntime(): boolean {
  return (
    // Vercel Edge Runtime
    (typeof process !== 'undefined' && process.env?.NEXT_RUNTIME === 'edge') ||
    // Cloudflare Workers
    (typeof globalThis !== 'undefined' && ((globalThis as any).caches || (globalThis as any).EdgeRuntime))
  );
}

/**
 * Get a human-readable platform description for logging
 */
export function getPlatformDescription(): string {
  const caps = detectPlatform();

  const features: string[] = [];
  if (caps.hasNodeAPIs) features.push('Node.js APIs');
  if (caps.hasPlaywright) features.push('Playwright');
  if (caps.hasD1Database) features.push('D1 Database');
  if (caps.isEdgeRuntime) features.push('Edge Runtime');

  const featuresStr = features.length > 0 ? ` [${features.join(', ')}]` : '';
  return `${caps.platform}${featuresStr}`;
}
