/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker
  output: "standalone",

  // Optimize for production
  poweredByHeader: false,

  // Server external packages (moved from experimental.serverComponentsExternalPackages)
  serverExternalPackages: [],

  // Image optimization configuration
  images: {
    // Configure for containerized deployment
    unoptimized: process.env.NODE_ENV === "production",
  },

  // Headers for better performance and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
