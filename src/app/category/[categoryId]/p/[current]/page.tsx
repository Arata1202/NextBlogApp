import { getAllCategoryLists, getList } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import CategoryPage from '@/components/Pages/Category';
import { getCategoryForPage } from '@/libs/microcmsPage';
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

export const generateStaticParams = async () => {
  const categories = await getAllCategoryLists({
    fields: 'id',
  });

  const results = await Promise.all(
    categories.map(async (category) => {
      const categoryId = category.id;

      const data = await getList({
        limit: 0,
        fields: '',
        filters: `categories[contains]${categoryId}`,
      });

      const totalCount = data.totalCount;
      const totalPages = Math.ceil(totalCount / LIMIT);
      const currents = Array.from({ length: totalPages }, (_, i) => i + 1);

      return currents.map((current) => ({
        categoryId,
        current: current.toString(),
      }));
    }),
  );

  return results.flat();
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
    getCategoryForPage(params.categoryId, { fields: 'id,name' }),
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
