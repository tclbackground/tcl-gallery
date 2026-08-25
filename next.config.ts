// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  /*
   * Allow development access from local
   * and network IP addresses.
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
  ],

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",

      allowedOrigins: [
        "172.16.4.83",
        "172.16.4.83:3000",
        "172.16.4.106",
        "172.16.4.106:3000",
        "localhost:3000",
        "127.0.0.1:3000",
        "tclgallery.com",
        "www.tclgallery.com",
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