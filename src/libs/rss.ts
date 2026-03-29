import { Feed } from 'feed';
import fs from 'fs';
import { getAllLists } from './microcms';
import { getZennFeed } from './zenn';
import { COPYRIGHT, DESCRIPTION } from '@/constants/data';
import { UnifiedArticle } from '@/types/unified';

export const generateRssFeed = async () => {
  try {
    const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

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

    const data = await getAllLists({
      fields: 'id,title,description,categories,thumbnail,publishedAt',
    });

    const blogItems: UnifiedArticle[] = data.map((item) => ({
      id: `blog-${item.id}`,
      title: item.title,
      description: item.description,
      publishedAt: item.publishedAt!,
      thumbnailUrl: item.thumbnail?.url,
      url: `${url}/articles/${item.id}`,
      source: 'blog',
    }));

    const zennItems = await getZennFeed('realunivlog', 50);

    const merged = [...blogItems, ...zennItems].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

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
              category: data
                .find((d) => `blog-${d.id}` === item.id)
                ?.categories.map((category) => ({ name: category.name })),
            }
          : {}),
        image: item.thumbnailUrl,
      });
    });

    fs.writeFileSync('./public/rss.xml', feed.rss2());

    console.log('RSS Feed generated successfully');
  } catch (error) {
    console.error('Error generating RSS Feed:', error);
  }
};
