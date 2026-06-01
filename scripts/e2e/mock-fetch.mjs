import { categories, getArticles, getZennArticles, tags } from '../../e2e/fixtures/content.mjs';

const originalFetch = globalThis.fetch.bind(globalThis);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://127.0.0.1:3000';
const microCmsHost = `${process.env.MICROCMS_SERVICE_DOMAIN}.microcms.io`;

const getArticleDate = (article) => article.publishedAt ?? article.createdAt;

const jsonResponse = (body) =>
  new Response(JSON.stringify(body), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

const createListResponse = (contents, searchParams) => {
  const offset = Number(searchParams.get('offset') ?? 0);
  const limit = Number(searchParams.get('limit') ?? 10);
  const slicedContents = limit === 0 ? [] : contents.slice(offset, offset + limit);

  return {
    contents: slicedContents,
    limit,
    offset,
    totalCount: contents.length,
  };
};

const extractFilterValue = (filters, key) => {
  const match = filters.match(new RegExp(`${key}([^,\\[]+)`));
  return match?.[1];
};

const filterArticles = (searchParams) => {
  const filters = searchParams.get('filters') ?? '';
  let articles = getArticles(baseUrl);

  const categoryId = extractFilterValue(filters, 'categories\\[contains\\]');
  if (categoryId) {
    articles = articles.filter((article) =>
      article.categories.some((category) => category.id === categoryId),
    );
  }

  const tagId = extractFilterValue(filters, 'tags\\[contains\\]');
  if (tagId) {
    articles = articles.filter((article) => article.tags?.some((tag) => tag.id === tagId));
  }

  const excludedTitle = extractFilterValue(filters, 'title\\[not_equals\\]');
  if (excludedTitle) {
    articles = articles.filter((article) => article.title !== excludedTitle);
  }

  const greaterThan = extractFilterValue(filters, 'publishedAt\\[greater_than\\]');
  if (greaterThan) {
    const start = new Date(greaterThan).getTime();
    articles = articles.filter((article) => new Date(getArticleDate(article)).getTime() > start);
  }

  const lessThan = extractFilterValue(filters, 'publishedAt\\[less_than\\]');
  if (lessThan) {
    const end = new Date(lessThan).getTime();
    articles = articles.filter((article) => new Date(getArticleDate(article)).getTime() < end);
  }

  return articles.sort(
    (a, b) => new Date(getArticleDate(b)).getTime() - new Date(getArticleDate(a)).getTime(),
  );
};

const notFoundResponse = () =>
  new Response(JSON.stringify({ message: 'Not found' }), {
    status: 404,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });

const getCollection = (endpoint, searchParams) => {
  if (endpoint === 'blog') {
    return filterArticles(searchParams);
  }

  if (endpoint === 'categories') {
    return categories;
  }

  if (endpoint === 'tags') {
    return tags;
  }

  return undefined;
};

const getDetail = (endpoint, contentId) => {
  const collection = getCollection(endpoint, new URLSearchParams());
  return collection?.find((item) => item.id === contentId);
};

const handleMicroCmsRequest = (url) => {
  if (url.hostname !== microCmsHost) {
    return undefined;
  }

  const [, api, version, endpoint, contentId] = url.pathname.split('/');
  if (api !== 'api' || version !== 'v1' || !endpoint) {
    return undefined;
  }

  if (contentId) {
    const detail = getDetail(endpoint, contentId);
    return detail ? jsonResponse(detail) : notFoundResponse();
  }

  const collection = getCollection(endpoint, url.searchParams);
  if (!collection) {
    return undefined;
  }

  return jsonResponse(createListResponse(collection, url.searchParams));
};

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const createZennFeedXml = () => {
  const items = getZennArticles(baseUrl)
    .map(
      (article) => `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${escapeXml(article.url)}</link>
          <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
          <description>${escapeXml(article.description)}</description>
          <enclosure url="${escapeXml(article.thumbnailUrl)}" type="image/webp" />
        </item>`,
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>${items}</channel></rss>`;
};

globalThis.fetch = async (input, init) => {
  const requestUrl = input instanceof Request ? input.url : String(input);
  const url = new URL(requestUrl);

  const microCmsResponse = handleMicroCmsRequest(url);
  if (microCmsResponse) {
    return microCmsResponse;
  }

  if (url.href === 'https://zenn.dev/realunivlog/feed') {
    return new Response(createZennFeedXml(), {
      headers: {
        'content-type': 'application/rss+xml; charset=utf-8',
      },
    });
  }

  return originalFetch(input, init);
};
