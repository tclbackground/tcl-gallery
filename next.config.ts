import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  /*
   * Keep Prisma as a real Node.js dependency at runtime.
   * This is important for GoDaddy's Node.js hosting because
   * Prisma needs access to its native query engine files.
   */
  serverExternalPackages: ["@prisma/client", "prisma"],

  /*
   * Allow development access from local,
   * network IP addresses, production domains, and GoDaddy preview URL.
   */
  allowedDevOrigins: [
    "172.16.4.83",
    "172.16.4.83:3000",
    "172.16.4.106",
    "172.16.4.106:3000",
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    "tclgallery.com",
    "www.tclgallery.com",
    "5852wjwnoi.preview.c35.airoapp.ai",
  ],

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",

      allowedOrigins: [
        "172.16.4.83",
        "172.16.4.83:3000",
        "localhost:3000",
        "127.0.0.1:3000",
        "tclgallery.com",
        "www.tclgallery.com",
        "5852wjwnoi.preview.c35.airoapp.ai",
      ],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;