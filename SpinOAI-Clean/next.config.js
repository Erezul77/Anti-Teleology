/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  publicRuntimeConfig: {
    // Add any public runtime config here if needed
  },
  // Exclude archive directory from build
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /archive/,
    })
    // Add path alias for shared teleology engine
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '../src'),
    }
    return config
  },
  // Exclude archive from page generation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig 