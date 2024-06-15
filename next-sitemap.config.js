/** @type {import('next-sitemap').IConfig} */
const { createClient } = require('microcms-js-sdk');

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getList = async (queries) => {
  try {
    const listData = await client.getList({
      endpoint: 'blog',
      queries,
    });
    return listData;
  } catch (error) {
    console.error('Failed to fetch blog list:', error);
    return { contents: [] };
  }
};

const getTagList = async (queries) => {
  try {
    const listData = await client.getList({
      endpoint: 'tags',
      queries,
    });
    return listData;
  } catch (error) {
    console.error('Failed to fetch tag list:', error);
    return { contents: [] };
  }
};

module.exports = {
  siteUrl: 'https://realunivlog.com/',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  additionalPaths: async (config) => {
    const paths = [];

    const articles = await getList({ limit: 100 });
    articles.contents.forEach((article) => {
      paths.push({
        loc: `${config.siteUrl}/articles/${article.id}`,
        lastmod: new Date(article.updatedAt).toISOString(),
        changefreq: 'daily',
        priority: 0.7,
      });
    });

    const tags = await getTagList({ limit: 100 });
    tags.contents.forEach((tag) => {
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
