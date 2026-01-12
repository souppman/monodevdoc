import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    let bffUrl = process.env.BFF_URL || 'http://localhost:4000';
    if (bffUrl !== 'http://localhost:4000' && !bffUrl.startsWith('http')) {
      bffUrl = `https://${bffUrl}`;
    }
    return [
      {
        source: '/api/:path*',
        destination: `${bffUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
