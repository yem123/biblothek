import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "german-library-api.yemanemeasho2021.workers.dev",
      },
    ],
  },
};

export default nextConfig;
