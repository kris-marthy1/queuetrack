/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable specific headers for caching
  async headers() {
    return [
      {
        // For static assets
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // For static files
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // For fonts
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Default policy for other routes
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  // Optimize image loading
  images: {
    domains: [], // Add domains you load images from
    formats: ['image/avif', 'image/webp'],
  },
  // Improve performance
  swcMinify: true,
  // Compress responses
  compress: true,
};

module.exports = nextConfig;
