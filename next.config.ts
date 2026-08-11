import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Moved to top level to match NextConfig types
  allowedDevOrigins: ["172.16.4.106:3000", "localhost:3000", "172.16.4.106"],
  
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;