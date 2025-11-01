import type { NextConfig } from "next";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname
  },
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
