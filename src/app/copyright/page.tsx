import { getList } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants';
import CopyrightPage from '@/components/Pages/Copyright';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <CopyrightPage articles={data.contents} />
    </>
  );
}
