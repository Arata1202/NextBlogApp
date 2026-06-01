export type FixtureCategory = {
  createdAt: string;
  id: string;
  name: string;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
};

export type FixtureTag = FixtureCategory;

export type FixtureArticle = {
  categories: FixtureCategory[];
  content_blocks: Array<{ rich_text: string }>;
  createdAt: string;
  description: string;
  id: string;
  introduction_blocks: Array<{ rich_text: string }>;
  publishedAt: string;
  revisedAt: string;
  tags: FixtureTag[];
  thumbnail: {
    height: number;
    url: string;
    width: number;
  };
  title: string;
  updatedAt: string;
};

export type FixtureZennArticle = {
  description: string;
  id: string;
  publishedAt: string;
  source: 'zenn';
  thumbnailUrl: string;
  title: string;
  url: string;
};

export const categories: FixtureCategory[];
export const tags: FixtureTag[];
export function getArticles(baseUrl?: string): FixtureArticle[];
export function getFixtureImageUrl(baseUrl?: string): string;
export function getZennArticles(baseUrl?: string): FixtureZennArticle[];
