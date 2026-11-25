import { load } from 'cheerio';
import { UnifiedArticle } from '@/types/unified';

const FALLBACK_IMAGE = '/images/blog/title.webp';

type GetZennFeedOptions = {
  includeAll?: boolean;
};

const extractFirstImage = (html: string) => {
  return load(html, {}, false)('img[src]').first().attr('src');
};

const extractText = (html: string) => {
  if (!html) return '';
  const $ = load(html);
  return $.root().text().replace(/\s+/g, ' ').trim();
};

const truncate = (text: string, max = 140) => {
  const characters = [...text];
  if (characters.length <= max) return text;
  return `${characters.slice(0, max - 1).join('')}…`;
};

const buildZennFeedUrl = (userId: string, includeAll = false) => {
  const url = new URL(`https://zenn.dev/${encodeURIComponent(userId)}/feed`);
  if (includeAll) {
    url.searchParams.set('all', '1');
  }

  return url.toString();
};

const getZennArticleId = (link: string) => {
  if (!URL.canParse(link)) return null;
  const url = new URL(link);
  if (url.origin !== 'https://zenn.dev' || url.username || url.password) return null;
  const [, , kind, slug] = url.pathname.split('/');
  return kind === 'articles' && slug ? `zenn-${slug}` : `zenn-${url.pathname}`;
};

export const getZennFeed = async (
  userId: string,
  limit = 10,
  options: GetZennFeedOptions = {},
): Promise<UnifiedArticle[]> => {
  try {
    const url = buildZennFeedUrl(userId, options.includeAll);
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    return $('item')
      .toArray()
      .flatMap((item): UnifiedArticle[] => {
        const el = $(item);
        const title = el.find('title').text().trim();
        const link = el.find('link').text().trim();
        const pubDate = el.find('pubDate').text().trim();
        const id = getZennArticleId(link);
        if (!id || !Number.isFinite(Date.parse(pubDate))) return [];
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

        return [
          {
            id,
            title,
            description,
            publishedAt: pubDate,
            url: link,
            thumbnailUrl: image,
            source: 'zenn',
          },
        ];
      })
      .slice(0, limit);
  } catch (error) {
    console.warn('Zenn feed unavailable', error);
    return [];
  }
};
