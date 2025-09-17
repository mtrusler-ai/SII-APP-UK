// next.config.mjs (ESM-safe, works on Vercel)

// ESM safe __dirname
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only define aliases and simple fallbacks; avoid client polyfills.
  webpack: (config, { isServer }) => {
    // Make sure alias objects exist
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
      '@/src': path.resolve(__dirname, 'src'),
    }

    // Do NOT try to bundle fs/path in the browser
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs: false,
      // leave 'path' false for client; Node has it on server anyway
      path: false,
    }

    return config
  },

  // Keep defaults; no experimental polyfills
}

export default nextConfig
