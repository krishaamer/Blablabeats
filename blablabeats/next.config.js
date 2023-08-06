/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      // Create glob to target specific pages you want
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0',
        },
      ],
    },
    {
      // Create glob to target specific pages you want
      source: '/api/token',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0',
        },
      ],
    },
  ],
}

module.exports = nextConfig
