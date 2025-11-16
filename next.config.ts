import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // ESLint configuration - ignore during production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration - ignore errors during builds (optional, can be removed if strict checking needed)
  typescript: {
    ignoreBuildErrors: false, // Keep strict TypeScript checking
  },

  // Webpack configuration to handle optional dependencies
  webpack: (config, { isServer }) => {
    // Ignore optional keyv adapters that are not needed
    // These are optional dependencies that keyv tries to dynamically require
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@keyv/redis': false,
      '@keyv/mongo': false,
      '@keyv/sqlite': false,
      '@keyv/postgres': false,
      '@keyv/mysql': false,
      '@keyv/etcd': false,
      '@keyv/offline': false,
      '@keyv/tiered': false,
    };

    // Ignore these modules in externals for server-side builds
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          '@keyv/redis': 'commonjs @keyv/redis',
          '@keyv/mongo': 'commonjs @keyv/mongo',
          '@keyv/sqlite': 'commonjs @keyv/sqlite',
          '@keyv/postgres': 'commonjs @keyv/postgres',
          '@keyv/mysql': 'commonjs @keyv/mysql',
          '@keyv/etcd': 'commonjs @keyv/etcd',
          '@keyv/offline': 'commonjs @keyv/offline',
          '@keyv/tiered': 'commonjs @keyv/tiered',
        });
      }
    }

    return config;
  },

  // Image optimization
  images: {
    unoptimized: true, // Disable image optimization for Cloudflare Workers compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/s2/favicons/**',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images (for website favicons)
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
