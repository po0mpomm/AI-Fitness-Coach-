/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: [
    '10.57.205.231:3000',
    'localhost:3000',
  ],
};

module.exports = nextConfig;

