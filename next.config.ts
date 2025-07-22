import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Other config options here

  eslint: {
    // Ignoring ESLint errors during build
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Ignoring TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
