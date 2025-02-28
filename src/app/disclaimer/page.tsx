import DisclaimerPage from '@/components/Pages/Disclaimer';
import { getList } from '@/libs/Microcms';
import { RECENT_LIMIT } from '@/constants/Limit';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <DisclaimerPage articles={data.contents} />
    </>
  );
}
