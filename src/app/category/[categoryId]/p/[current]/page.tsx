import { getList, getCategory } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
import CategoryPage from '@/components/Pages/Category';

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

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { categoryId } = params;

  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    offset: LIMIT * (current - 1),
    filters: `categories[contains]${categoryId}`,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
  });
  const category = await getCategory(params.categoryId);

  return (
    <>
      <CategoryPage
        articles={data.contents}
        category={category}
        current={current}
        totalCount={data.totalCount}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
