const dateFields = {
  createdAt: '2026-05-01T00:00:00.000Z',
  revisedAt: '2026-05-01T00:00:00.000Z',
};

export const categories = [
  {
    id: 'university',
    name: '大学生活',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'work',
    name: '社会人生活',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'leisure',
    name: 'レジャー',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'travel',
    name: '旅行',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'programming',
    name: 'プログラミング',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'blog',
    name: 'ブログ',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
];

export const tags = [
  {
    id: 'playwright',
    name: 'Playwright',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
  {
    id: 'career',
    name: 'キャリア',
    ...dateFields,
    publishedAt: dateFields.createdAt,
    updatedAt: dateFields.revisedAt,
  },
];

const getCategory = (id) => categories.find((category) => category.id === id);
const getTag = (id) => tags.find((tag) => tag.id === id);

export const getFixtureImageUrl = (baseUrl = 'http://127.0.0.1:3000') =>
  new URL('/images/blog/title.webp', baseUrl).toString();

const createArticle = (index, baseUrl) => {
  const paddedIndex = String(index).padStart(2, '0');
  const isMayArticle = index <= 11;
  const publishedAt = isMayArticle
    ? `2026-05-${String(28 - index).padStart(2, '0')}T09:00:00.000Z`
    : '2026-04-20T09:00:00.000Z';
  const primaryCategory = index % 4 === 0 ? getCategory('university') : getCategory('programming');
  const articleTags =
    index % 3 === 0
      ? [getTag('playwright'), getTag('career')]
      : [getTag('playwright'), getTag('nextjs')];

  return {
    id: `e2e-article-${index}`,
    title: `E2E Playwright 導入ガイド ${paddedIndex}`,
    description: `Playwright E2E の主要導線を検証するための固定記事 ${paddedIndex} です。`,
    thumbnail: {
      url: getFixtureImageUrl(baseUrl),
      width: 1200,
      height: 630,
    },
    categories: [primaryCategory],
    tags: articleTags,
    introduction_blocks: [
      {
        rich_text: '<p>Playwrightでブログの主要導線を安定して検証するための導入記事です。</p>',
      },
    ],
    content_blocks: [
      {
        rich_text:
          '<h2 id="main-flow">主要導線</h2><p>記事一覧、カテゴリ、タグ、検索を確認します。</p><h3 id="stable-ci">安定したCI</h3><p>外部サービスはモックして、ブラウザ上の振る舞いを検証します。</p>',
      },
    ],
    createdAt: publishedAt,
    publishedAt,
    revisedAt: publishedAt,
    updatedAt: index === 1 ? '2026-05-31T09:00:00.000Z' : publishedAt,
  };
};

export const getArticles = (baseUrl) =>
  Array.from({ length: 12 }, (_, index) => createArticle(index + 1, baseUrl));

export const getZennArticles = (baseUrl) => [
  {
    id: 'zenn-e2e-1',
    title: 'Zenn E2E 補助記事',
    description: '外部フィードを固定データとして扱うための補助記事です。',
    publishedAt: '2026-05-03T09:00:00.000Z',
    url: 'https://zenn.dev/realunivlog/articles/e2e-support',
    thumbnailUrl: getFixtureImageUrl(baseUrl),
    source: 'zenn',
  },
];
