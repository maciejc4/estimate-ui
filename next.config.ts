import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/estimate-ui' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/estimate-ui/' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
