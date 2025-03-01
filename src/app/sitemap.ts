import type { MetadataRoute } from 'next';
import { getAllLists } from '@/libs/microcms';
import { CategoryArray } from '@/constants/Blog/CategoryArray';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllLists();

  const url = process.env.NEXT_PUBLIC_BASE_URL;
  const lastModified = new Date();
  const changeFrequency = 'daily';
  const priority = 0.7;

  const appPages: MetadataRoute.Sitemap = [
    {
      url: `${url}`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/copyright`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/profile`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/privacy`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/contact`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/disclaimer`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
    {
      url: `${url}/link`,
      lastModified: lastModified,
      changeFrequency: changeFrequency,
      priority: priority,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = CategoryArray.map((category) => {
    return {
      url: `${url}/category/${category.id}`,
      lastModified: lastModified,
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

  return [...appPages, ...categoryPages, ...articlePages];
}
