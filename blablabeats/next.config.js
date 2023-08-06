/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: () => [
    {
      // Create glob to target specific pages you want
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
}

module.exports = nextConfig
