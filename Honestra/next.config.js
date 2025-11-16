/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config) => {
    // Ensure node_modules from this project are resolved when processing shared files
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, 'node_modules'),
    ];
    
    // Add alias to resolve shared teleologyEngine from monorepo root
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, '../src'),
    };
    
    return config;
  },
};

module.exports = nextConfig;

