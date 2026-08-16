import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.16.4.106:3000", "localhost:3000", "172.16.4.106"],

  typescript: {
    ignoreBuildErrors: true,
  },

  // Supported in Next.js 14+ / 15 / 16
  serverActions: {
    bodySizeLimit: "100mb",
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  // Bypass Next.js type error for ESLint
  ...({
    eslint: {
      ignoreDuringBuilds: true,
    },
  } as any),
};

export default nextConfig;