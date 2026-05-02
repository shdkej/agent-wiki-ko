import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  basePath: isProd ? '/agent-wiki' : '',
  assetPrefix: isProd ? '/agent-wiki' : '',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default withMDX(config);
