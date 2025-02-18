import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import CopyrightPage from '@/components/Pages/Copyright';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <CopyrightPage articles={data.contents} />
    </>
  );
}
