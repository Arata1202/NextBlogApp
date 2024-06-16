const { createClient } = require('microcms-js-sdk');
const RSS = require('rss');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

const getAllContents = async (endpoint) => {
  let allContents = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await client.getList({
      endpoint,
      queries: { offset, limit },
    });
    if (res.contents.length === 0) break;
    allContents = allContents.concat(res.contents);
    offset += limit;
  }
  return allContents;
};

const generateRSSFeed = async () => {
  const feed = new RSS({
    title: 'リアル大学生',
    description: '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。',
    feed_url: 'https://realunivlog.com/rss.xml',
    site_url: 'https://realunivlog.com',
    language: 'ja',
    ttl: 60,
  });

  const articles = await getAllContents('blog');

  articles.forEach((article) => {
    feed.item({
      title: article.title,
      description: article.description,
      url: `https://realunivlog.com/articles/${article.id}`,
      author: 'あお',
      date: article.publishedAt,
      categories: article.tags.map((tag) => tag.name),
      enclosure: {
        url: article.thumbnail.url,
        type: 'image/jpg',
      },
    });
  });

  const xml = feed.xml({ indent: true });

  fs.writeFileSync(path.join(__dirname, 'public', 'rss.xml'), xml);
  console.log('RSS feed generated successfully');
};

generateRSSFeed().catch((error) => {
  console.error('Error generating RSS feed:', error);
});
