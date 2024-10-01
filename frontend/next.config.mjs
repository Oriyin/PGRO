/** @type {import('next').NextConfig} */

const API_URL = "http://backend:8000";

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // This ensures images are not optimized in case you don't need Next.js image optimization
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`, // Rewrites API requests to the backend service
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        poll: 800, // Allows polling for file changes
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
