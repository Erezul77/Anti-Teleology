import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    // Ensure node_modules from this project are resolved when processing shared files
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, "node_modules"),
    ];
    return config;
  },
};

export default nextConfig;
