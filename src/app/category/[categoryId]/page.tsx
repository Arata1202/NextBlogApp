import { getList, getCategory } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
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
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    filters: `categories[contains]${categoryId}`,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const category = await getCategory(params.categoryId);

  return (
    <>
      <CategoryPage
        articles={data.contents}
        category={category}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
