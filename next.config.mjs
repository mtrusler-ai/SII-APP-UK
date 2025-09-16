import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    // Resolve '@' to the project root, allowing imports like '@/src/lib/db'
    config.resolve.alias['@'] = path.resolve(process.cwd()); // no __dirname in ESM
    return config;
  },
};

export default nextConfig;

