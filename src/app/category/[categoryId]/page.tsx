import { getAllCategoryLists, getList } from '@/libs/microcms';
import { LIMIT } from '@/constants/limit';
import CategoryPage from '@/components/Pages/Category';
import { getCategoryForPage } from '@/libs/microcmsPage';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    categoryId: string;
  }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const categories = await getAllCategoryLists({
    fields: 'id',
  });

  return categories.map((category) => ({ categoryId: category.id }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { categoryId } = params;

  const [data, category, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
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
        totalCount={data.totalCount}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
