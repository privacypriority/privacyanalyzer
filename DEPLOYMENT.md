# Deployment Guide

PrivacyAnalyzer deploys to **Vercel** with a **Neon Postgres** database (via the Vercel Marketplace) for analysis caching and history.

## Prerequisites

- Vercel account
- Neon Postgres database (provision from the Vercel Marketplace: **Storage → Create → Neon**, or bring your own Neon project)
- OpenRouter API key(s) — [get one](https://openrouter.ai/)
- Firecrawl API key (optional, improves scraping + screenshots) — [get one](https://firecrawl.dev/)

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and in `.env.local` for local dev):

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ (for caching/history) | Neon Postgres pooled connection string. `POSTGRES_URL` is also accepted. |
| `OPENROUTER_API` | ✅ | Primary OpenRouter API key. |
| `OPENROUTER_API_1`, `OPENROUTER_API_2` | ⬜ | Additional keys for rotation / higher throughput. |
| `FIRECRAWL_API_KEY` | ⬜ | Enables Firecrawl scraping + homepage screenshots. |
| `CRON_SECRET` | ⬜ | If set, protects `/api/cron/refresh-keys` (sent as `Authorization: Bearer <secret>`). |

> When you add Neon from the Vercel Marketplace, `DATABASE_URL` / `POSTGRES_URL` are injected automatically.

If `DATABASE_URL` is absent, the app still runs — analyses are computed on every request and the history / results-by-domain pages report that the database is unavailable.

## Deploy

1. Import the GitHub repo into Vercel (**Add New → Project**).
2. Add the environment variables above.
3. Deploy. Vercel auto-detects Next.js; no extra build config is needed.

The database schema is created automatically on first use (idempotent `CREATE TABLE IF NOT EXISTS`), so there is no manual migration step.

CLI alternative:

```bash
npm i -g vercel
vercel        # preview
vercel --prod # production   (also: npm run deploy)
```

## AI models

Analysis uses OpenRouter with automatic fallback, in order (`ANALYSIS_MODELS` in `src/app/api/analyze/route.ts`):

1. `openrouter/free` — default (auto-routed free model)
2. `nvidia/nemotron-3-ultra-550b-a55b:free`
3. `openai/gpt-oss-20b:free`

If one model errors or is rate-limited, the next is tried (with API-key rotation across the configured keys).

## Runtime notes

- API routes run on the **Node.js runtime** (`export const runtime = 'nodejs'`) for full scraping support.
- Scraping order: Firecrawl (if key set) → Crawlee/Playwright → plain `fetch`.
- The analysis cache keys on `(domain, SHA-256(content))` with a 30-day freshness window, so unchanged policies skip the AI call.
