/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
    ],
  },

  // Enable compression
  compress: true,
  // Turbopack root to silence multi-lockfile warning when workspace has multiple package-lock.json
  turbopack: {
    root: './',
  },
};

export default nextConfig;
