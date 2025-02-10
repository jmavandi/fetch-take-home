import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "frontend-take-home.fetch.com",
      },
      {
        protocol: "https",
        hostname: "frontend-take-home-service.fetch.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://frontend-take-home-service.fetch.com/:path*",
      },
    ];
  },
};

export default nextConfig;
