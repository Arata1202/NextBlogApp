import { getAllCategoryLists, getList } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import CategoryPage from '@/components/Pages/Category';
import { getCategoryForPage, taxonomyFields } from '@/libs/microcmsPage';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    categoryId: string;
    current: string;
  }>;
};

export const metadata = {
  robots: {
    index: false,
  },
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await getAllCategoryLists({
    fields: 'id',
  });

  const results: { categoryId: string; current: string }[] = [];
  for (const { id } of categories) {
    const { totalCount } = await getList({
      limit: 0,
      fields: '',
      filters: `categories[contains]${id}`,
    });
    for (let current = 1; current <= Math.ceil(totalCount / LIMIT); current++) {
      results.push({ categoryId: id, current: String(current) });
    }
  }
  return results;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { categoryId } = params;

  const current = parseInt(params.current as string, 10);

  const [data, category, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: LIMIT * (current - 1),
      filters: `categories[contains]${categoryId}`,
    }),
    getCategoryForPage(params.categoryId, taxonomyFields),
    getSidebarData(),
  ]);
  const { recentArticles, tags, archiveList } = sidebarData;

  return (
    <>
      <CategoryPage
        articles={data.contents}
        category={category}
        current={current}
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
