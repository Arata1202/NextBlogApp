import { getList, getCategory, getAllTagLists } from '@/libs/microcms';
import { getArchiveList } from '@/libs/archive';
import { LIMIT } from '@/constants/limit';
import { CATEGORY_ARR } from '@/constants/category';
import CategoryPage from '@/components/Pages/Category';
import { getMixedRecentArticles } from '@/libs/recent';

type Props = {
  params: Promise<{
    categoryId: string;
  }>;
};

export const generateStaticParams = async () => {
  return CATEGORY_ARR.map((category) => ({ categoryId: category.id }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { categoryId } = params;

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    filters: `categories[contains]${categoryId}`,
  });
  const recentArticles = await getMixedRecentArticles();
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const category = await getCategory(params.categoryId, { fields: 'id,name' });
  const archiveList = await getArchiveList();

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
