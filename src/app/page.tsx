import { ZENN_ACCOUNT } from '@/constants/zenn';
import { serializeJsonLd } from '@/utils/jsonLd';
import { getSiteUrl, getSiteTitle } from '@/config/site';
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
    getZennFeed(ZENN_ACCOUNT, LIMIT),
  ]);
  const { tags, archiveList } = navigationData;

  const blogArticles = mapBlogArticlesToUnified(data.contents);
  const mixedArticles = mixUnifiedArticles(blogArticles, zennArticles, LIMIT);
  // Page two starts at the next CMS offset; retain first-page posts displaced by external entries.
  const featuredIds = new Set(mixedArticles.map((item) => item.id));
  const homeArticles = [
    ...mixedArticles,
    ...blogArticles.filter((item) => !featuredIds.has(item.id)),
  ];
  const recentArticles = mixedArticles.slice(0, RECENT_LIMIT);
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();
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
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />
      <HomePage
        articles={data.contents}
        mixedArticles={homeArticles}
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
