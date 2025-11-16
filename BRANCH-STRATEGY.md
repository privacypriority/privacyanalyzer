# Branch Strategy

This repository uses a **dual-branch deployment strategy** to optimize for different platforms.

## Branches

### `main` - Vercel Deployment (Node.js Runtime)

**Optimized for:** Vercel serverless functions

**Configuration:**
- Runtime: `nodejs`
- Full Playwright support for browser automation
- 60-second function timeout
- Three-tier scraping: Firecrawl → Playwright → fetch

**Deploy to Vercel:**
```bash
# Automatic deployment on push to main
git push origin main

# Or manual deployment
vercel --prod
```

**Best for:**
- Quick deployment with GitHub integration
- Full scraping capabilities
- Development and testing

---

### `worker` - Cloudflare Workers Deployment (Edge Runtime)

**Optimized for:** Cloudflare Workers global edge network

**Configuration:**
- Runtime: `edge`
- D1 Database caching (30-day cache)
- Two-tier scraping: Firecrawl → fetch (Playwright not available)
- Global edge performance

**Deploy to Cloudflare:**
```bash
# Build for Cloudflare Workers
npm run worker:build

# Deploy
npm run deploy

# Or manually
wrangler deploy
```

**Best for:**
- Production deployment with D1 caching
- Global edge performance
- Cost-effective at scale

---

## Choosing a Branch

| Feature | `main` (Vercel) | `worker` (Cloudflare) |
|---------|----------------|---------------------|
| **Runtime** | Node.js | Edge |
| **Playwright** | ✅ Yes | ❌ No |
| **Database Cache** | ❌ No | ✅ D1 (30 days) |
| **Timeout** | 60s | Configurable |
| **Deployment** | Auto (GitHub) | CLI/GitHub Actions |
| **Best For** | Development, Full features | Production, Caching |

---

## Keeping Branches in Sync

### Sync main → worker

When you make changes to core logic (not platform-specific config):

```bash
# On worker branch
git checkout worker
git merge main

# Resolve conflicts (keep worker's runtime config)
# Usually conflicts will be in:
# - src/app/api/analyze/route.ts (runtime config)
# - src/app/api/v1/analyzer/route.ts (runtime config)

git push origin worker
```

### Platform-Specific Files

**Files that should differ between branches:**
- `src/app/api/*/route.ts` - Runtime configuration
- `.github/workflows/` - Deployment workflows (if different)

**Files that should be the same:**
- All business logic and components
- Analysis prompts and scoring
- UI and frontend code
- Shared utilities

---

## Development Workflow

1. **Make changes on `main` branch** (default development)
2. **Test locally:** `npm run dev`
3. **Push to main:** Auto-deploys to Vercel
4. **Merge to worker:** When ready for Cloudflare deployment
5. **Deploy worker:** `npm run deploy`

---

## GitHub Actions Setup (Optional)

### Auto-deploy main to Vercel
Already handled by Vercel's GitHub integration.

### Auto-deploy worker to Cloudflare

Create `.github/workflows/deploy-worker.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [worker]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - run: npm run worker:build

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

---

## Quick Reference

```bash
# Switch to Vercel branch
git checkout main

# Switch to Cloudflare branch
git checkout worker

# Sync worker with main changes
git checkout worker
git merge main
git push origin worker

# Deploy Vercel (main branch)
git push origin main

# Deploy Cloudflare (worker branch)
git checkout worker
npm run deploy
```
