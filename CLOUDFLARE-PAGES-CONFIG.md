# Cloudflare Pages Configuration

## Issue: npm ci Failing

The worker branch is experiencing `npm ci` failures on Cloudflare Pages due to:
1. Node.js version limitations (Pages uses 20.17.0, packages need 22.0.0+)
2. Dynamic Vercel dependencies from `@cloudflare/next-on-pages` not in package-lock.json

## Recommended Solution: Use Cloudflare Workers (Not Pages)

### Option 1: Cloudflare Workers Deployment (Recommended)

**Use wrangler CLI for direct Workers deployment:**

```bash
# On worker branch
npm run worker:build
npx wrangler deploy --env=""
```

**Benefits:**
- Uses local Node.js version (22.0.0+)
- No npm ci sync issues
- Direct control over deployment
- Uses wrangler.toml configuration

### Option 2: Cloudflare Pages with Custom Build

If you must use Cloudflare Pages, configure these settings in the Cloudflare dashboard:

**Build Configuration:**
- **Build command**: `npm install && npm run pages:build`
- **Build output directory**: `.vercel/output/static`
- **Node version**: Add `.nvmrc` file with `22`
- **Environment variables**:
  - `NODE_VERSION=22`
  - Add any API keys (FIRECRAWL_API_KEY, OPENAI_API_KEY, etc.)

**Note**: Cloudflare Pages may still use Node 20.17.0 despite these settings.

### Option 3: Main Branch on Vercel (Current Production)

The main branch is already configured for Vercel and works perfectly:
- ✅ Node.js 22 support
- ✅ Full Playwright/Firecrawl functionality
- ✅ No build issues

## Current Branch Status

| Branch | Platform | Node.js | Status |
|--------|----------|---------|--------|
| main | Vercel | 22.0.0 | ✅ Production Ready |
| worker | Cloudflare Workers | 22.0.0 | ⚠️ Manual deployment only |
| worker | Cloudflare Pages | Limited | ❌ Build failing |

## Recommended Deployment Strategy

1. **Production**: Use main branch on **Vercel**
2. **Testing**: Use worker branch with **wrangler CLI** (manual deployment)
3. **Avoid**: Cloudflare Pages auto-deployment (has too many limitations)

## Files Added

- `.nvmrc` - Specifies Node.js 22
- `.node-version` - Alternative Node version file (22.0.0)

## Next Steps

Choose one of these paths:

**Path A: Stick with Vercel (Recommended)**
- Continue using main branch
- Vercel handles everything automatically
- No build issues

**Path B: Manual Cloudflare Workers Deployment**
- Use: `wrangler login` → `npm run worker:build` → `wrangler deploy --env=""`
- Deploy manually when needed
- Skip Cloudflare Pages entirely

**Path C: Fix Cloudflare Pages** (Complex)
- Would require removing @cloudflare/next-on-pages
- Switch to @opennextjs/cloudflare (has other issues)
- Not recommended due to complexity
