import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    const bffUrl = process.env.BFF_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${bffUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
