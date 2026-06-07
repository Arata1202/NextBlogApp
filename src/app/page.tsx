import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getZennFeed } from '@/libs/zenn';
import { mapBlogArticlesToUnified, mixUnifiedArticles } from '@/libs/unified';
import { DESCRIPTION, PROFILE_NAME, SOCIAL_ICON } from '@/constants/data';
import { getSidebarNavigationData } from '@/libs/pageData';

export default async function Page() {
  const [data, navigationData, zennArticles] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    }),
    getSidebarNavigationData(),
    getZennFeed('realunivlog', LIMIT),
  ]);
  const { tags, archiveList } = navigationData;

  const blogArticles = mapBlogArticlesToUnified(data.contents);
  const mixedArticles = mixUnifiedArticles(blogArticles, zennArticles, LIMIT);
  const recentArticles = mixedArticles.slice(0, RECENT_LIMIT);
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${defaultUrl}#website`,
    name: defaultTitle,
    url: defaultUrl,
    description: DESCRIPTION,
    inLanguage: 'ja-JP',
    publisher: {
      '@type': 'Person',
      '@id': `${defaultUrl}/profile#person`,
      name: PROFILE_NAME,
      url: `${defaultUrl}/profile`,
      sameAs: SOCIAL_ICON.map((icon) => icon.path),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePage
        articles={data.contents}
        mixedArticles={mixedArticles}
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
