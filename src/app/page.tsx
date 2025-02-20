import { getList, getAllLists } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import HomePage from '@/components/Pages/Home';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  const allData = await getAllLists();

  return (
    <>
      <HomePage articles={data.contents} totalCount={data.totalCount} allArticles={allData} />
    </>
  );
}
