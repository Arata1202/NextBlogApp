/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('microcms-js-sdk');

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getAllContents = async (endpoint) => {
  let allContents = [];
  let offset = 0;
  const limit = 100;

  try {
    while (true) {
      const res = await client.getList({
        endpoint,
        queries: { offset, limit, fields: 'id,updatedAt' },
      });
      if (res.contents.length === 0) break;
      allContents = allContents.concat(res.contents);
      offset += limit;
    }
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
  }

  return allContents;
};

module.exports = {
  siteUrl: 'https://realunivlog.com/',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const paths = [];

    const articles = await getAllContents('blog');
    articles.forEach((article) => {
      paths.push({
        loc: `${config.siteUrl}/articles/${article.id}`,
        lastmod: new Date(article.updatedAt).toISOString(),
        changefreq: 'daily',
        priority: 0.7,
      });
    });

    const tags = await getAllContents('tags');
    tags.forEach((tag) => {
      paths.push({
        loc: `${config.siteUrl}/category/${tag.id}`,
        lastmod: new Date(tag.updatedAt).toISOString(),
        changefreq: 'daily',
        priority: 0.7,
      });
    });

    return paths;
  },
};
