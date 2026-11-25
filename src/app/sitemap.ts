import { getSiteUrl } from '@/config/site';
import type { MetadataRoute } from 'next';
import { getAllLists } from '@/libs/microcms';
import { CATEGORY_ARR } from '@/constants/category';
import { PAGE_ARR } from '@/constants/page';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllLists({
    fields: 'id,updatedAt',
  });

  const url = getSiteUrl();
  const changeFrequency = 'daily';
  const priority = 0.7;

  const topPage: MetadataRoute.Sitemap = [
    {
      url: `${url}`,
      changeFrequency: changeFrequency,
      priority: priority,
    },
  ];

  const appPages: MetadataRoute.Sitemap = PAGE_ARR.map((page) => {
    return {
      url: `${url}/${page.path}`,
      changeFrequency: changeFrequency,
      priority: priority,
    };
  });

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_ARR.map((category) => {
    return {
      url: `${url}/category/${category.id}`,
      changeFrequency: changeFrequency,
      priority: priority,
    };
  });

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => {
    return {
      url: `${url}/articles/${article.id}`,
      lastModified: article.updatedAt,
      changeFrequency: changeFrequency,
      priority: priority,
    };
  });

  return [...topPage, ...appPages, ...categoryPages, ...articlePages];
}
