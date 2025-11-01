# Cloudflare Deployment Guide

## ⚠️ Error: Dynamic require not supported

If you're seeing this error:
```
Error: Dynamic require of "/server/chunks/ssr/[root-of-the-server]__*._.js" is not supported
```

This happens because Cloudflare Workers use ES modules and don't support CommonJS `require()`.

## ✅ Solution

### Step 1: Upgrade Node.js to v20+

**Option A: Using nvm (Recommended)**
```bash
# Install nvm if you haven't: https://github.com/nvm-sh/nvm
nvm install 20
nvm use 20

# Verify version
node --version  # Should show v20.x.x or higher
```

**Option B: Download from nodejs.org**
- Visit https://nodejs.org/
- Download Node.js v20 LTS or later
- Install and restart your terminal

### Step 2: Clean and Rebuild

```bash
# Clean all build artifacts and dependencies
rm -rf .next .open-next node_modules package-lock.json

# Reinstall dependencies with Node 20+
npm install

# Build for Cloudflare Workers
npm run build:cf
```

### Step 3: Run Locally

```bash
# Start local development server with Wrangler
npm run run:cf
```

### Step 4: Deploy to Cloudflare

```bash
# Deploy to Cloudflare Workers
npm run deploy:cf
```

## 🔧 Configuration Changes Made

1. **Removed `output: "standalone"`** from `next.config.ts`
   - This option conflicts with OpenNext Cloudflare build process
   - OpenNext handles the build output automatically

2. **All pages converted to client-side rendering**
   - Added `'use client'` directive to all page components
   - This eliminates SSR-related dynamic require issues in Cloudflare Workers
   - Improves compatibility with Cloudflare Workers ESM environment

3. **Disabled image optimization** in `next.config.ts`
   - Added `unoptimized: true` for better Cloudflare Workers compatibility
   - Cloudflare has its own image optimization services

4. **Updated compatibility_date** in `wrangler.toml`
   - Changed to current date for latest Cloudflare Workers features

5. **Added `.nvmrc`** file
   - Specifies Node.js version 20.17.0
   - Helps maintain consistent Node version across team

6. **Added engines field** in `package.json`
   - Ensures Node.js 20+ is used

## 📝 Why This Error Happens

1. **ES Modules Only**: Cloudflare Workers runtime only supports ES modules (ESM)
2. **Dynamic Imports**: Next.js generates code with dynamic `require()` statements
3. **OpenNext Transformation**: OpenNext transforms Next.js output for Cloudflare Workers
4. **Node.js Version**: Older Node versions lack necessary compatibility fixes

## 🚀 Development Workflow

```bash
# Local development (standard Next.js)
npm run dev

# Local development (Cloudflare Workers simulation)
npm run run:cf

# Production build for Cloudflare
npm run build:cf

# Deploy to Cloudflare
npm run deploy:cf
```

## 🐛 Common Issues

### Issue: "yargs parser supports a minimum Node.js version of 20"
**Solution**: Upgrade to Node.js 20+ (see Step 1 above)

### Issue: "Failed to load chunk" errors
**Solution**: 
1. Clean build artifacts: `rm -rf .next .open-next`
2. Rebuild: `npm run build:cf`

### Issue: D1 Database not found locally
**Solution**: This is normal for local development. D1 bindings work in production deployment.

### Issue: Environment variables not working
**Solution**: 
- Local: Add to `.dev.vars` file (not committed)
- Production: Add via Cloudflare dashboard or `wrangler secret put`

## 📚 Additional Resources

- [OpenNext Cloudflare Documentation](https://opennext.js.org/cloudflare)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

## 🔐 Environment Variables

Create a `.dev.vars` file for local development:

```bash
# .dev.vars (don't commit this file!)
OPENROUTER_API=your_api_key_here
OPENROUTER_API_1=your_backup_key_1
OPENROUTER_API_2=your_backup_key_2
FIRECRAWL_API_KEY=your_firecrawl_key
```

For production, use Wrangler secrets:

```bash
wrangler secret put OPENROUTER_API
wrangler secret put FIRECRAWL_API_KEY
```

## ✨ Success Checklist

- [ ] Node.js version 20+ installed
- [ ] All dependencies reinstalled with Node 20+
- [ ] Build completes without errors: `npm run build:cf`
- [ ] Local development works: `npm run run:cf`
- [ ] App loads at http://localhost:8787
- [ ] No "dynamic require" errors in console
- [ ] Ready to deploy: `npm run deploy:cf`

---

**Need Help?** Check the error logs in `.wrangler/` directory or consult the OpenNext Cloudflare documentation.
