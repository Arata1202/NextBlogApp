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
  const articles = await getAllLists({ fields: 'id' });
  return articles.map(({ id }) => ({ slug: id }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const article = getArticleDetailForPage(params.slug);
  const [data, recentArticles, relatedArticles, sidebarData] = await Promise.all([
    article,
    getMixedRecentArticles(RECENT_LIMIT + 1),
    article.then((data) => {
      const categoryId = data.categories?.[0]?.id;
      return categoryId
        ? getList({
            limit: RECENT_LIMIT,
            fields: 'id,title,tags,description,thumbnail,publishedAt,updatedAt',
            filters: `categories[contains]${categoryId}[and]id[not_equals]${data.id}`,
          }).then((result) => result.contents)
        : [];
    }),
    getSidebarNavigationData(),
  ]);
  const { tags, archiveList } = sidebarData;

  return (
    <>
      <ArticlePage
        recentArticles={recentArticles}
        article={data}
        relatedArticles={relatedArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
