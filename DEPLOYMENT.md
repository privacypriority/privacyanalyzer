# Cloudflare Workers Deployment Guide

This guide will help you deploy PrivacyHub to Cloudflare Workers with full production configuration including D1 database, Browser Rendering, and all necessary bindings.

## Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)
- Wrangler CLI installed (`npm install -g wrangler`)
- OpenRouter API key ([get one here](https://openrouter.ai/))
- Firecrawl API key (optional, [get one here](https://firecrawl.dev/))

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Login to Cloudflare

```bash
npm run cf:login
# or
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

## Step 3: Create D1 Database

```bash
# Create the database
wrangler d1 create an-db
```

Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "an-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with actual ID
```

## Step 4: Run Database Migrations

```bash
# Apply the schema migration
wrangler d1 execute an-db --file=./migrations/0001_initial_schema.sql

# Or use the npm script
npm run d1:execute
```

Verify the migration:

```bash
wrangler d1 execute an-db --command="SELECT * FROM analysis_stats;"
```

## Step 5: Configure Environment Variables (Secrets)

Set your API keys as secrets in Cloudflare:

```bash
# Primary OpenRouter API key (required)
wrangler secret put OPENROUTER_API

# Additional keys for rotation (optional, recommended)
wrangler secret put OPENROUTER_API_1
wrangler secret put OPENROUTER_API_2

# Firecrawl API key (optional)
wrangler secret put FIRECRAWL_API_KEY
```

**Alternative:** Set secrets via Cloudflare Dashboard:
1. Go to Workers & Pages > Your Worker
2. Settings > Variables and Secrets
3. Add each secret with "Encrypt" enabled

## Step 6: Configure Bindings in Cloudflare Dashboard

Your bindings should already be configured from the screenshots:

### D1 Database
- **Binding name:** `DB`
- **Database:** `an-db`

### Browser Rendering
- **Binding name:** `BROWSER`
- **Type:** Browser Rendering

### Assets
- **Binding name:** `ASSETS`
- **Type:** Workers Assets (or R2)

### Service Binding (optional)
- **Binding name:** `WORKER_SELF_REFERENCE`
- **Service:** `privacyhub`
- **Environment:** `production`

## Step 7: Build the Project

```bash
# Build for Cloudflare Workers
npm run worker:build
```

This will:
1. Run Next.js build
2. Use @cloudflare/next-on-pages to adapt for Workers

## Step 8: Deploy

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

Or manually:

```bash
wrangler deploy
```

## Step 9: Verify Deployment

After deployment, Wrangler will output your worker URL:

```
Published privacyhub (version xxx)
  https://privacyhub.YOUR-SUBDOMAIN.workers.dev
```

Test the deployment:

```bash
curl https://privacyhub.YOUR-SUBDOMAIN.workers.dev/
```

## Custom Domain Setup

1. Go to Cloudflare Dashboard > Workers & Pages > Your Worker
2. Click **Settings** > **Domains & Routes**
3. Click **Add** > **Custom Domain**
4. Enter your domain (e.g., `privacyhub.in`)
5. Cloudflare will automatically configure DNS

## Environment-Specific Deployments

### Development

```bash
wrangler deploy --env development
```

### Staging

```bash
wrangler deploy --env staging
```

### Production

```bash
wrangler deploy --env production
# or
npm run deploy
```

## Monitoring & Logs

### View Real-time Logs

```bash
wrangler tail
```

### View Logs in Dashboard

1. Go to Cloudflare Dashboard
2. Workers & Pages > Your Worker
3. Click on **Logs** tab

### Check D1 Database Stats

```bash
wrangler d1 execute an-db --command="
  SELECT
    total_analyses,
    unique_domains,
    avg_score,
    updated_at
  FROM analysis_stats;
"
```

## Troubleshooting

### Issue: "No bindings found"

**Solution:** Verify `wrangler.toml` has correct binding configuration:

```toml
[[d1_databases]]
binding = "DB"
database_name = "an-db"
database_id = "your-database-id"
```

### Issue: "Database not found"

**Solution:** Ensure D1 database is created and migrations are applied:

```bash
wrangler d1 list
wrangler d1 execute an-db --file=./migrations/0001_initial_schema.sql
```

### Issue: "OpenRouter API key not found"

**Solution:** Set the secret:

```bash
wrangler secret put OPENROUTER_API
```

Verify in Cloudflare Dashboard > Workers & Pages > Settings > Variables and Secrets

### Issue: "Browser Rendering not available"

**Solution:** Enable Browser Rendering in Cloudflare Dashboard:
1. Workers & Pages > Your Worker
2. Settings > Bindings
3. Add binding > Browser Rendering
4. Name: `BROWSER`

### Issue: Build fails with Turbopack

**Solution:** The build script has been updated to use standard Next.js build (no Turbopack) for Cloudflare compatibility:

```json
"build": "next build"
```

### Issue: API routes not working

**Solution:** Ensure you're using the Edge Runtime:

```typescript
export const runtime = 'edge';
```

## Performance Optimization

### Enable Caching

The app uses D1 database for caching analysis results. Cache is automatically:
- Stored for 30 days
- Invalidated when content changes (content hash)
- Shared across all requests

### Rate Limiting

Configure rate limiting per IP in the API route if needed:

```typescript
// Currently disabled for MVP, but ready to enable
// See src/app/api/analyze/route.ts line 377-393
```

### Database Cleanup

Run cleanup periodically to remove old analyses (90+ days):

```bash
wrangler d1 execute an-db --command="
  DELETE FROM analyses
  WHERE created_at < datetime('now', '-90 days');
"
```

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - run: npm ci

      - run: npm run worker:build

      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Required GitHub Secrets

1. Go to GitHub > Repository > Settings > Secrets
2. Add:
   - `CLOUDFLARE_API_TOKEN` (get from Cloudflare Dashboard > My Profile > API Tokens)
   - `CLOUDFLARE_ACCOUNT_ID` (get from Cloudflare Dashboard > Workers & Pages)

## Cost Estimates

### Free Tier Limits

- **Workers:** 100,000 requests/day
- **D1:** 100,000 reads/day, 1 GB storage
- **Browser Rendering:** 2,000 sessions/month
- **Total:** $0/month for moderate usage

### Paid Tier (if needed)

- **Workers Paid:** $5/month + $0.30/million requests
- **D1 Paid:** $5/month + $0.001/1000 reads
- **Browser Rendering:** $5/month + usage
- **Estimated:** $15-25/month for high traffic

## Security Checklist

- [ ] All API keys stored as encrypted secrets
- [ ] CORS headers configured in wrangler.toml
- [ ] Rate limiting enabled (if needed)
- [ ] Error messages don't expose sensitive data
- [ ] Database migrations applied
- [ ] Custom domain with HTTPS

## Support

If you encounter issues:

1. Check [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
2. Review [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
3. Open an issue on [GitHub](https://github.com/privacypriority/privacyhub/issues)

## Quick Reference

```bash
# Development
npm run dev                    # Local development
npm run worker:dev            # Wrangler dev server

# Building
npm run build                 # Next.js build
npm run worker:build          # Build for Workers

# Deployment
npm run deploy                # Deploy to production
wrangler deploy --env staging # Deploy to staging

# Database
npm run d1:migrate            # Apply migrations
npm run d1:execute            # Execute schema

# Monitoring
wrangler tail                 # Real-time logs
wrangler d1 execute an-db --command="SELECT COUNT(*) FROM analyses;"
```
