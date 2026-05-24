import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getZennFeed } from '@/libs/zenn';
import { mapBlogArticlesToUnified, mixUnifiedArticles } from '@/libs/unified';
import { DESCRIPTION, PROFILE_NAME, SOCIAL_ICON } from '@/constants/data';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();
  const zennArticles = await getZennFeed('realunivlog', LIMIT);

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
