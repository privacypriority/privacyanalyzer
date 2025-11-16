/**
 * Cloudflare Workers Environment Bindings
 * Type definitions for all bindings configured in wrangler.toml
 */

import { D1Database } from '@/lib/d1-database';

declare global {
  interface CloudflareEnv {
    // D1 Database binding
    DB: D1Database;

    // Browser rendering binding for Puppeteer
    BROWSER: Fetcher;

    // Assets binding
    ASSETS: Fetcher;

    // Service binding for self-reference
    WORKER_SELF_REFERENCE: Fetcher;

    // Environment variables (secrets)
    FIRECRAWL_API_KEY: string;
    OPENROUTER_API: string;
    OPENROUTER_API_1?: string;
    OPENROUTER_API_2?: string;

    // Standard environment variables
    NODE_ENV?: string;
  }
}

// Extend the NextRequest type to include Cloudflare context
declare module 'next/server' {
  interface NextRequest {
    env?: CloudflareEnv;
  }
}

export {};
