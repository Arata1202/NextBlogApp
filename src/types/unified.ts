export type UnifiedArticleSource = 'blog' | 'zenn';

export type UnifiedArticle = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  thumbnailUrl?: string;
  url: string;
  source: UnifiedArticleSource;
};
