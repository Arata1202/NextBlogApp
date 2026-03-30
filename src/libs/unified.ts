import { Article } from '@/types/microcms';
import { UnifiedArticle } from '@/types/unified';

export const mapBlogArticlesToUnified = (articles: Article[]): UnifiedArticle[] => {
  return articles.map((item) => ({
    id: `blog-${item.id}`,
    title: item.title,
    description: item.description ?? '',
    publishedAt: item.publishedAt!,
    updatedAt: item.updatedAt,
    thumbnailUrl: item.thumbnail?.url,
    url: `/articles/${item.id}`,
    source: 'blog',
  }));
};

export const mixUnifiedArticles = (
  blogArticles: UnifiedArticle[],
  externalArticles: UnifiedArticle[],
  limit: number,
) => {
  return [...blogArticles, ...externalArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};
