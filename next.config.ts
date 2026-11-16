import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root to this folder (avoids picking up stray lockfiles above it).
  turbopack: { root: process.cwd() },
  // Locale-aware root layout lives in app/[locale]; unmatched URLs use
  // app/global-not-found.tsx (a real 404, rendered outside any layout).
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
  },
};

export default nextConfig;
