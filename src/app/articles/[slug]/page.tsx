import { getList, getAllLists } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/limit';
import ArticlePage from '@/components/Pages/Article';
import { getMixedRecentArticles } from '@/libs/recent';
import { getArticleDetailForPage } from '@/libs/microcmsPage';
import { getSidebarNavigationData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const data = await getAllLists({
    fields: 'id',
  });

  return data.map((slug) => ({ slug: slug.id }));
};

export default async function Page(props: Props) {
  const params = await props.params;

  const data = await getArticleDetailForPage(params.slug);
  const [recentArticles, relatedArticles, sidebarData] = await Promise.all([
    getMixedRecentArticles(RECENT_LIMIT + 1),
    getList({
      limit: RECENT_LIMIT,
      fields: 'id,title,tags,description,thumbnail,publishedAt,updatedAt',
      filters: `categories[contains]${data.categories[0].id},title[not_equals]${data.title}`,
    }),
    getSidebarNavigationData(),
  ]);
  const { tags, archiveList } = sidebarData;

  return (
    <>
      <ArticlePage
        recentArticles={recentArticles}
        article={data}
        relatedArticles={relatedArticles.contents}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
