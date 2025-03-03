import { Feed } from 'feed';
import fs from 'fs';
import { getAllLists } from './microcms';
import { COPYRIGHT } from '@/constants/data';

export const generateRssFeed = async () => {
  try {
    const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

    const title = defaultTitle!;
    const description = `大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。`;
    const url = defaultUrl!;
    const copyright = COPYRIGHT![0].title;

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

    const data = await getAllLists();

    data.forEach((item) => {
      feed.addItem({
        title: item.title,
        id: `${url}/articles/${item.id}`,
        link: `${url}/articles/${item.id}`,
        description: item.description,
        date: new Date(item.publishedAt!),
        author: [{ name: title }],
        category: item.categories.map((category) => ({ name: category.name })),
        image: item.thumbnail.url,
      });
    });

    fs.writeFileSync('./public/rss.xml', feed.rss2());

    console.log('RSS Feed generated successfully');
  } catch (error) {
    console.error('Error generating RSS Feed:', error);
  }
};
