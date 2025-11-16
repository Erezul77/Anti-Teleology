/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    // Ensure node_modules from this project are resolved when processing shared files
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      require('path').resolve(__dirname, 'node_modules'),
    ];
    return config;
  },
};

module.exports = nextConfig;

