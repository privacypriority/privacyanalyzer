# CLAUDE.md

Guidance for AI assistants (Claude Code) working in this repository.

## Commit rules

- **No AI attribution in commits.** Do NOT add `Co-Authored-By: Claude ...`, `Generated with Claude Code`, or any similar AI attribution to commit messages, PR descriptions, or code comments. Commits are authored as the repository owner only.
- Write clear, imperative commit messages describing what changed and why.
- Do not commit or push unless explicitly asked.
- Never commit secrets. `.env*` is gitignored — keep it that way.

## Project overview

PrivacyAnalyzer (privacyanalyzer.in) — an AI-powered privacy policy analyzer for India's DPDP Act 2023 / Rules 2025.

- **Framework:** Next.js 15 (App Router), React 19, TypeScript, Tailwind.
- **Hosting:** Vercel only (Node.js runtime). No Cloudflare/Workers/D1.
- **Database:** Neon Postgres via `src/lib/db.ts` (`@neondatabase/serverless`, reads `DATABASE_URL`). Caches analyses by `(domain, SHA-256(content))` for 30 days; schema auto-creates on first use. Degrades gracefully when no DB is configured.
- **AI:** OpenRouter (`@openrouter/sdk`). Models in `ANALYSIS_MODELS` (default → fallback): `openrouter/free`, `nvidia/nemotron-3-ultra-550b-a55b:free`, `openai/gpt-oss-20b:free`. `OPENROUTER_API_0` is the default API key (with `OPENROUTER_API`/`_1`/`_2` fallbacks).
- **Scraping:** Firecrawl → Crawlee/Playwright → fetch.

## Env vars

`DATABASE_URL`, `OPENROUTER_API_0` (required); `OPENROUTER_API`, `OPENROUTER_API_1`, `OPENROUTER_API_2`, `FIRECRAWL_API_KEY`, `CRON_SECRET` (optional). Set locally in `.env.local` and in Vercel project settings.

## Checks before committing

```bash
npm run typecheck   # tsc --noEmit
npm run build       # next build
```
