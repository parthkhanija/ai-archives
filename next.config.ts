import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', //new
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
