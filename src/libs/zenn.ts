import { load } from 'cheerio';
import { UnifiedArticle } from '@/types/unified';

const FALLBACK_IMAGE = '/images/blog/title.webp';

const extractFirstImage = (html: string) => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
};

const extractText = (html: string) => {
  if (!html) return '';
  const $ = load(html);
  return $.root().text().replace(/\s+/g, ' ').trim();
};

const truncate = (text: string, max = 140) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
};

export const getZennFeed = async (userId: string, limit = 10): Promise<UnifiedArticle[]> => {
  try {
    const url = `https://zenn.dev/${userId}/feed`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    return $('item')
      .toArray()
      .slice(0, limit)
      .map((item, index) => {
        const el = $(item);
        const title = el.find('title').text().trim();
        const link = el.find('link').text().trim();
        const pubDate = el.find('pubDate').text().trim();
        const descriptionHtml = el.find('description').text().trim();
        const contentHtml = el.find('content\\:encoded').text().trim();

        const enclosure = el.find('enclosure').attr('url');
        const mediaThumb = el.find('media\\:thumbnail').attr('url');
        const image =
          enclosure ||
          mediaThumb ||
          extractFirstImage(contentHtml) ||
          extractFirstImage(descriptionHtml) ||
          FALLBACK_IMAGE;

        const description = truncate(extractText(descriptionHtml || contentHtml));

        return {
          id: `zenn-${index}`,
          title,
          description,
          publishedAt: pubDate,
          url: link,
          thumbnailUrl: image,
          source: 'zenn',
        };
      });
  } catch {
    return [];
  }
};
