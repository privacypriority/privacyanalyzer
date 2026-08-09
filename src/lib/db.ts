/**
 * Postgres (Neon) database helpers for PrivacyAnalyzer.
 * Replaces the previous Cloudflare D1 layer for Vercel deployment.
 *
 * Connection is read from DATABASE_URL (or POSTGRES_URL). When neither is set
 * — e.g. local dev without a database — the helpers degrade gracefully so the
 * app still works without caching/history.
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export interface StoredAnalysis {
  id: number;
  url: string;
  domain: string;
  hostname: string;
  content_hash: string;
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  dpdp_act_compliance: string | null;
  analysis_data: string; // JSON string
  homepage_screenshot: string | null;
  scraper_used: string | null;
  content_length: number | null;
  created_at: string;
  updated_at: string;
  last_checked_at: string;
}

export interface AnalysisData {
  overall_score: number;
  privacy_grade: string;
  risk_level: string;
  regulatory_compliance: {
    dpdp_act_compliance?: string;
    major_violations?: string[];
  };
  categories: Record<string, unknown>;
  critical_findings?: Record<string, unknown>;
  positive_practices?: string[];
  actionable_recommendations?: Record<string, unknown>;
  executive_summary?: string;
}

function getConnectionString(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

/** Whether a Postgres connection is configured (used for graceful degradation). */
export function isDatabaseConfigured(): boolean {
  return !!getConnectionString();
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

/** Get the Neon SQL client, or null when no database is configured. */
function getSql(): NeonQueryFunction<false, false> | null {
  const connectionString = getConnectionString();
  if (!connectionString) return null;
  if (!cachedSql) {
    cachedSql = neon(connectionString);
  }
  return cachedSql;
}

/**
 * Generate SHA-256 hash of content for the cache key.
 * Uses the Web Crypto API (available in Node.js and Edge runtimes).
 */
export async function generateContentHash(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Extract the registrable domain (sans leading www.) from a URL. */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Initialize the database schema. Idempotent — safe to call on every request.
 * No-op when no database is configured.
 */
export async function initializeDatabase(): Promise<void> {
  const sql = getSql();
  if (!sql) return;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS analyses (
        id BIGSERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        domain TEXT NOT NULL,
        hostname TEXT NOT NULL,
        content_hash TEXT NOT NULL,
        overall_score DOUBLE PRECISION NOT NULL,
        privacy_grade TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        dpdp_act_compliance TEXT,
        analysis_data TEXT NOT NULL,
        homepage_screenshot TEXT,
        scraper_used TEXT,
        content_length INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        last_checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        UNIQUE (domain, content_hash)
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_domain ON analyses (domain)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses (created_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_last_checked ON analyses (last_checked_at DESC)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_analyses_domain_checked ON analyses (domain, last_checked_at DESC)`;
  } catch (error) {
    console.error('[DB] Schema initialization failed:', error);
    // Non-fatal: allow the app to continue without caching.
  }
}

/**
 * Return a cached analysis for (domain, contentHash) that is at most 30 days old.
 */
export async function getCachedAnalysis(
  domain: string,
  contentHash: string
): Promise<StoredAnalysis | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = (await sql`
      SELECT * FROM analyses
      WHERE domain = ${domain}
        AND content_hash = ${contentHash}
        AND last_checked_at > now() - interval '30 days'
      ORDER BY last_checked_at DESC
      LIMIT 1
    `) as unknown as StoredAnalysis[];
    return rows[0] || null;
  } catch (error) {
    console.error('[DB] Error fetching cached analysis:', error);
    return null;
  }
}

/**
 * Insert a new analysis, or touch the timestamps of an existing identical one.
 * Returns the row id, or null when no database is configured / on failure.
 */
export async function saveAnalysis(
  url: string,
  content: string,
  analysisData: AnalysisData,
  metadata: { scraperUsed?: string; homepageScreenshot?: string | null } = {}
): Promise<number | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const domain = extractDomain(url);
    const hostname = new URL(url).hostname;
    const contentHash = await generateContentHash(content);

    const rows = (await sql`
      INSERT INTO analyses (
        url, domain, hostname, content_hash,
        overall_score, privacy_grade, risk_level, dpdp_act_compliance,
        analysis_data, homepage_screenshot, scraper_used, content_length
      ) VALUES (
        ${url}, ${domain}, ${hostname}, ${contentHash},
        ${analysisData.overall_score}, ${analysisData.privacy_grade}, ${analysisData.risk_level},
        ${analysisData.regulatory_compliance?.dpdp_act_compliance ?? null},
        ${JSON.stringify(analysisData)}, ${metadata.homepageScreenshot ?? null},
        ${metadata.scraperUsed ?? null}, ${content.length}
      )
      ON CONFLICT (domain, content_hash) DO UPDATE SET
        last_checked_at = now(),
        updated_at = now()
      RETURNING id
    `) as unknown as Array<{ id: number }>;

    return rows[0]?.id ?? null;
  } catch (error) {
    console.error('[DB] Error saving analysis:', error);
    throw error;
  }
}

/** Get recent analyses (paginated, newest first). */
export async function getRecentAnalyses(
  limit: number = 24,
  offset: number = 0
): Promise<StoredAnalysis[]> {
  const sql = getSql();
  if (!sql) return [];

  try {
    const rows = (await sql`
      SELECT * FROM analyses
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `) as unknown as StoredAnalysis[];
    return rows;
  } catch (error) {
    console.error('[DB] Error fetching recent analyses:', error);
    return [];
  }
}

/** Total number of stored analyses (for pagination). */
export async function getAnalysesCount(): Promise<number> {
  const sql = getSql();
  if (!sql) return 0;

  try {
    const rows = (await sql`SELECT COUNT(*)::int AS count FROM analyses`) as unknown as Array<{ count: number }>;
    return rows[0]?.count ?? 0;
  } catch (error) {
    console.error('[DB] Error counting analyses:', error);
    return 0;
  }
}

/** Get the most recent analysis for a domain (regardless of content hash). */
export async function getAnalysisByDomain(domain: string): Promise<StoredAnalysis | null> {
  const sql = getSql();
  if (!sql) return null;

  try {
    const rows = (await sql`
      SELECT * FROM analyses
      WHERE domain = ${domain}
      ORDER BY last_checked_at DESC
      LIMIT 1
    `) as unknown as StoredAnalysis[];
    return rows[0] || null;
  } catch (error) {
    console.error('[DB] Error fetching analysis by domain:', error);
    return null;
  }
}
