import type { MicroCMSImage } from 'microcms-js-sdk';

export type UnifiedArticleSource = 'blog' | 'zenn';

export type UnifiedArticle = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnail?: MicroCMSImage;
  thumbnailUrl?: string;
  url: string;
  source: UnifiedArticleSource;
};
