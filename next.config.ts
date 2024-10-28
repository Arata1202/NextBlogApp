import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'www.rentracks.jp',
        port: '',
        pathname: '/adx/**',
      },
      {
        protocol: 'http',
        hostname: 'www.image-rentracks.com',
        port: '',
        pathname: '/7876/**',
      },
    ],
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
