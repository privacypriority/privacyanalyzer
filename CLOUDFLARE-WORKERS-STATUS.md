# Cloudflare Workers Deployment Status

## Current Issue

The `worker` branch cannot build successfully for Cloudflare Workers deployment due to a known compatibility issue between `@opennextjs/cloudflare@1.12.0` and Next.js 14+/15+.

### Error

```
Invalid alias name: "next/dist/compiled/node-fetch"
Invalid alias name: "next/dist/compiled/ws"
Invalid alias name: "next/dist/compiled/@ampproject/toolbox-optimizer"
Invalid alias name: "next/dist/compiled/edge-runtime"
```

### Root Cause

OpenNext's esbuild bundler cannot process Next.js's internal compiled modules which have slashes in their names. This is a limitation of esbuild's alias system.

### Attempted Solutions

1. ✗ Upgraded @opennextjs/cloudflare to latest (1.12.0 - already latest)
2. ✗ Downgraded Next.js to 15.0.3 (same error)
3. ✗ Downgraded Next.js to 14.2.18 (same error)
4. ✗ Switched to @cloudflare/next-on-pages (requires Edge Runtime - incompatible with Playwright)
5. ✗ Modified open-next.config.ts configuration (no effect)

## Fixed Issues

The following issues were successfully resolved:

1. ✓ **Wrangler version conflict**: Removed duplicate wrangler@^3.105.0 from devDependencies
2. ✓ **npm ci failure**: Fixed package-lock.json conflicts
3. ✓ **Next.js config format**: Converted next.config.ts to next.config.mjs for Next.js 14 compatibility
4. ✓ **Package dependencies**: Regenerated package-lock.json with --legacy-peer-deps

## Current Configuration

### Worker Branch
- Next.js: 14.2.18
- @opennextjs/cloudflare: 1.12.0
- wrangler: 4.45.3 (in dependencies only)
- Runtime: nodejs (for Playwright support)

### Main Branch (Recommended for Production)
- Next.js: 15.5.2
- Platform: Vercel
- Runtime: nodejs
- Status: ✓ Working

## Deployment Commands

### If Cloudflare Workers Build Succeeds (Future)

```bash
# Login to Cloudflare (one-time)
wrangler login

# Build and deploy
npm run deploy
# OR
npm run worker:build && npx wrangler deploy --env=""
```

### Current Recommendation

**Use the `main` branch for Vercel deployment** until @opennextjs/cloudflare releases a fix for Next.js 14+/15+ compatibility.

## Workarounds Under Investigation

1. Wait for @opennextjs/cloudflare update with Next.js 15 support
2. Use Next.js 13.x (may have other compatibility issues)
3. Contribute a fix to @opennextjs/cloudflare repository
4. Use Cloudflare Pages with Edge Runtime (requires removing Playwright)

## When Will This Be Fixed?

Track the issue:
- @opennextjs/cloudflare GitHub: https://github.com/opennextjs/opennextjs-cloudflare
- Next.js 15 compatibility: https://github.com/opennextjs/opennextjs-cloudflare/issues

## Alternative: Cloudflare Pages (Edge Runtime Only)

If you don't need Playwright/Crawlee:

1. Change all API routes to Edge Runtime:
   ```typescript
   export const runtime = 'edge';
   ```

2. Use @cloudflare/next-on-pages:
   ```bash
   npm run pages:build
   npx wrangler pages deploy
   ```

This sacrifices web scraping functionality for Cloudflare compatibility.

## Status

- **Main Branch (Vercel)**: ✅ Production Ready
- **Worker Branch (Cloudflare Workers)**: ⚠️ Build Failing - Upstream Issue
- **Last Updated**: 2025-11-16
