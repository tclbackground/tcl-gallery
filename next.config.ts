// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
      allowedOrigins: [
        "172.16.4.106:3000",
        "localhost:3000",
        "172.16.4.106",
        "tclgallery.com",
        "www.tclgallery.com",
      ],
    },
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;