/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://realunivlog.com/',
  // generateRobotsTxt: true,
  outDir: 'out',
  sitemapSize: 7000,
  exclude: ['/p/*', '/category/*/p/*', '/tag/*', '/archive/*', '/manifest.json'],
};
