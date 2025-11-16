# Cloudflare Workers Production Deployment Checklist

**Branch:** `worker` (optimized for Cloudflare Workers)

Use this checklist to ensure a smooth production deployment to Cloudflare Workers.

---

## ✅ Pre-Deployment Checklist

### 1. Prerequisites Installed

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Wrangler CLI installed (`wrangler --version`)
- [ ] Git installed and configured

```bash
# Install Wrangler globally if not installed
npm install -g wrangler

# Verify installation
wrangler --version
```

### 2. Cloudflare Account Setup

- [ ] Cloudflare account created (free tier is fine)
- [ ] Logged into Wrangler CLI
- [ ] Account ID noted from dashboard

```bash
# Login to Cloudflare
wrangler login

# Get your account ID
wrangler whoami
```

### 3. API Keys Ready

- [ ] OpenRouter API key obtained from https://openrouter.ai/
- [ ] (Optional) Additional OpenRouter keys for rotation
- [ ] (Optional) Firecrawl API key from https://firecrawl.dev/

### 4. D1 Database Setup

- [ ] D1 database created
- [ ] Database ID copied to `wrangler.toml`
- [ ] Initial schema migration executed

```bash
# Create D1 database
wrangler d1 create privacyhub

# Copy the database_id from output and update wrangler.toml:
# [[d1_databases]]
# binding = "DB"
# database_name = "privacyhub"
# database_id = "YOUR_DATABASE_ID_HERE"

# Execute schema migration
wrangler d1 execute privacyhub --file=./migrations/0001_initial_schema.sql

# Verify database
wrangler d1 execute privacyhub --command="SELECT * FROM analysis_stats;"
```

---

## 🔐 Environment Variables & Secrets

### Set Secrets via Wrangler CLI

```bash
# Primary OpenRouter API key (REQUIRED)
wrangler secret put OPENROUTER_API

# Additional keys for rotation (OPTIONAL)
wrangler secret put OPENROUTER_API_1
wrangler secret put OPENROUTER_API_2

# Firecrawl API key (OPTIONAL, but recommended)
wrangler secret put FIRECRAWL_API_KEY
```

### Verify Secrets in Dashboard

1. Go to Cloudflare Dashboard
2. Navigate to: **Workers & Pages** → **Your Worker** → **Settings** → **Variables and Secrets**
3. Confirm all secrets are listed with "Encrypted" status

**Required Secrets:**
- ✅ `OPENROUTER_API`

**Optional Secrets:**
- `OPENROUTER_API_1`
- `OPENROUTER_API_2`
- `FIRECRAWL_API_KEY`

---

## 🔧 Configuration Verification

### 1. Check wrangler.toml

```bash
cat wrangler.toml
```

Verify:
- [ ] `name = "privacyhub"` (or your preferred worker name)
- [ ] `compatibility_date` is recent
- [ ] `compatibility_flags = ["nodejs_compat"]` is present
- [ ] D1 database binding configured with correct `database_id`
- [ ] `[observability.logs]` enabled for monitoring

### 2. Verify Edge Runtime Configuration

```bash
# Check API routes are using Edge Runtime
grep "export const runtime" src/app/api/analyze/route.ts
```

Expected output: `export const runtime = 'edge';`

### 3. Check Branch

```bash
git branch --show-current
```

Expected output: `worker`

If not on worker branch:
```bash
git checkout worker
```

---

## 🏗️ Build & Deploy

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Type Check

```bash
npm run typecheck
```

**Expected:** No TypeScript errors

### 3. Build for Production

```bash
npm run build
```

**Expected:** ✓ Compiled successfully

### 4. Build for Cloudflare

```bash
npm run pages:build
```

**Expected:** Creates `.open-next` directory with worker bundle

### 5. Test Locally (Optional)

```bash
npm run worker:dev
```

- [ ] Worker starts successfully
- [ ] Can access http://localhost:8787
- [ ] Test an analysis request
- [ ] Check logs for errors

Press `Ctrl+C` to stop when done testing.

### 6. Deploy to Production

```bash
npm run deploy
```

**Expected output:**
```
Published privacyhub (version xxx)
  https://privacyhub.YOUR-SUBDOMAIN.workers.dev
```

- [ ] Deployment successful
- [ ] Worker URL received
- [ ] No error messages

---

## 🧪 Post-Deployment Testing

### 1. Test Worker URL

```bash
# Replace with your actual worker URL
curl https://privacyhub.YOUR-SUBDOMAIN.workers.dev/
```

**Expected:** HTML response with PrivacyHub homepage

### 2. Test API Endpoint

Open your browser and navigate to:
```
https://privacyhub.YOUR-SUBDOMAIN.workers.dev/
```

- [ ] Homepage loads correctly
- [ ] Try analyzing a privacy policy URL
- [ ] Verify analysis completes successfully
- [ ] Check that results are cached (second request faster)

### 3. Check Logs

```bash
wrangler tail
```

- [ ] Logs stream in real-time
- [ ] Platform detection shows correct environment
- [ ] D1 database logs show successful queries
- [ ] No error messages

### 4. Test D1 Database

```bash
# Check if analyses are being stored
wrangler d1 execute privacyhub --command="SELECT COUNT(*) as total FROM analyses;"

# View recent analyses
wrangler d1 execute privacyhub --command="
  SELECT domain, privacy_grade, created_at
  FROM analyses
  ORDER BY created_at DESC
  LIMIT 5;
"
```

---

## 🌐 Custom Domain Setup (Optional)

### 1. Add Custom Domain

1. Go to **Cloudflare Dashboard** → **Workers & Pages** → **privacyhub**
2. Click **Settings** → **Domains & Routes**
3. Click **Add** → **Custom Domain**
4. Enter your domain (e.g., `privacyhub.in`)
5. Cloudflare automatically configures DNS

### 2. Verify Domain

- [ ] Domain added successfully
- [ ] DNS configured automatically
- [ ] SSL certificate provisioned
- [ ] Site accessible via custom domain

---

## 📊 Monitoring & Maintenance

### View Real-time Logs

```bash
wrangler tail

# Filter by specific log level
wrangler tail --format json | grep "error"
```

### Check Analytics

1. **Cloudflare Dashboard** → **Workers & Pages** → **privacyhub**
2. Click **Metrics** tab
3. Monitor:
   - Requests per second
   - Success rate
   - CPU time
   - Errors

### Database Maintenance

```bash
# Check database size
wrangler d1 execute privacyhub --command="
  SELECT
    COUNT(*) as total_analyses,
    COUNT(DISTINCT domain) as unique_domains,
    ROUND(AVG(overall_score), 2) as avg_score
  FROM analyses;
"

# Clean up old analyses (older than 90 days)
wrangler d1 execute privacyhub --command="
  DELETE FROM analyses
  WHERE created_at < datetime('now', '-90 days');
"
```

---

## 🚨 Troubleshooting

### Issue: "Deployment failed"

**Check:**
1. Verify you're logged in: `wrangler whoami`
2. Check account has permission for Workers
3. Verify wrangler.toml syntax
4. Check build completed successfully

### Issue: "Database not found"

**Solution:**
```bash
# List databases
wrangler d1 list

# If not found, create it
wrangler d1 create privacyhub

# Update database_id in wrangler.toml
# Run migration
wrangler d1 execute privacyhub --file=./migrations/0001_initial_schema.sql
```

### Issue: "OpenRouter API key not found"

**Solution:**
```bash
# Set the secret
wrangler secret put OPENROUTER_API

# Verify in dashboard
# Workers & Pages → Settings → Variables and Secrets
```

### Issue: "Edge runtime errors"

**Check:**
- [ ] On `worker` branch (not `main`)
- [ ] Runtime is set to `'edge'` in route files
- [ ] No Node.js-only code in Edge routes
- [ ] Playwright is conditionally loaded

### Issue: "Slow analysis / Timeouts"

**Recommendation:**
1. Ensure Firecrawl API key is configured (faster than fetch)
2. Check if target websites have rate limiting
3. Monitor CPU time in Cloudflare dashboard
4. Consider upgrading to Workers Paid plan for higher limits

---

## 🎯 Production Best Practices

- [ ] Use production environment in wrangler.toml
- [ ] Set up monitoring alerts in Cloudflare
- [ ] Configure rate limiting if needed
- [ ] Regular database cleanup (weekly/monthly)
- [ ] Monitor costs and usage
- [ ] Keep dependencies updated
- [ ] Test deployments in preview environment first

---

## 📝 Deployment Command Quick Reference

```bash
# Complete deployment from scratch
git checkout worker
npm install
npm run typecheck
npm run build
npm run pages:build
wrangler deploy

# Or use the all-in-one command
npm run deploy

# Preview deployment (test before production)
wrangler deploy --env preview

# View logs
wrangler tail

# Check database
wrangler d1 execute privacyhub --command="SELECT * FROM analysis_stats;"
```

---

## ✅ Final Checklist

Before marking deployment as complete:

- [ ] Worker deployed successfully
- [ ] Custom domain configured (if applicable)
- [ ] All secrets set and verified
- [ ] D1 database created and migrated
- [ ] Test analysis completed successfully
- [ ] Logs show no errors
- [ ] Analytics/monitoring configured
- [ ] Documentation updated with worker URL

---

**🎉 Deployment Complete!**

Your PrivacyHub instance is now running on Cloudflare Workers with:
- Global edge network performance
- D1 database caching (30-day cache)
- Automatic scaling
- Built-in DDoS protection

Monitor your deployment at: https://dash.cloudflare.com/
