import LinkPage from '@/components/Pages/Link';
import { getList } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/Limit';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <LinkPage articles={data.contents} />
    </>
  );
}
