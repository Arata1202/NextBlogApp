import { getList, getCategory, getAllLists } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import CategoryPage from '@/components/Pages/Category';

type Props = {
  params: Promise<{
    categoryId: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { categoryId } = params;

  const data = await getList({
    limit: LIMIT,
    filters: `categories[contains]${categoryId}`,
  });
  const allData = await getAllLists();
  const category = await getCategory(params.categoryId);

  return (
    <>
      <CategoryPage
        articles={data.contents}
        category={category}
        totalCount={data.totalCount}
        allArticles={allData}
      />
    </>
  );
}
