
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Keep TypeScript build errors enabled.
   * Fix errors instead of silently ignoring them.
   */

  /*
   * Allow development access from local,
   * network IP addresses, production domains,
   * and the GoDaddy preview URL.
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
     "xdq5dz0a9b.preview.c35.airoapp.ai",
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
