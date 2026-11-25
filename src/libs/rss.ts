import { ZENN_ACCOUNT } from '@/constants/zenn';
import { getSiteUrl, getSiteTitle } from '@/config/site';
import { Feed } from 'feed';
import fs from 'fs';
import { mapBlogArticlesToUnified } from './unified';
import { getAllLists } from './microcms';
import { getZennFeed } from './zenn';
import { COPYRIGHT, DESCRIPTION } from '@/constants/data';

export const generateRssFeedXml = async () => {
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = defaultTitle!;
  const description = DESCRIPTION;
  const url = defaultUrl!;
  const copyright = COPYRIGHT;

  const feed = new Feed({
    id: url,
    title: title,
    description: description,
    link: url,
    generator: 'RSS for Node',
    language: 'ja',
    copyright: copyright!,
    feedLinks: {
      rss: `${url}/rss.xml`,
    },
    author: {
      name: title,
    },
    ttl: 60,
  });

  const [data, zennItems] = await Promise.all([
    getAllLists({ fields: 'id,title,description,categories,thumbnail,publishedAt,updatedAt' }),
    getZennFeed(ZENN_ACCOUNT, 50, { includeAll: true }),
  ]);
  const blogItems = mapBlogArticlesToUnified(data).map((item) => ({
    ...item,
    url: new URL(item.url, url).href,
  }));
  const categories = new Map(data.map((article) => [`blog-${article.id}`, article.categories]));

  const merged = [...blogItems, ...zennItems]
    .filter((item) => Number.isFinite(Date.parse(item.publishedAt)))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  merged.forEach((item) => {
    feed.addItem({
      title: item.title,
      id: item.url,
      link: item.url,
      description: item.description,
      date: new Date(item.publishedAt),
      author: [{ name: title }],
      ...(item.source === 'blog'
        ? {
            category: categories.get(item.id)?.map((category) => ({ name: category.name })),
          }
        : {}),
      image: item.thumbnailUrl ? new URL(item.thumbnailUrl, url).href : undefined,
    });
  });

  return feed.rss2();
};

export const generateRssFeed = async () => {
  fs.writeFileSync('./public/rss.xml', await generateRssFeedXml());
};
