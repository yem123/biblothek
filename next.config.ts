import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-acbb5c2f03ef4301806109061e29aa0e.r2.dev",
      },
    ],
  },
};

export default nextConfig;
