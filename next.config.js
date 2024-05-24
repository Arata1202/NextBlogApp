/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});

module.exports = {
  images: {
    domains: ['images.microcms-assets.io'],
    remotePatterns: [
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
