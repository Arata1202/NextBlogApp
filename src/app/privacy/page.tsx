import { getList } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/limit';
import PrivacyPage from '@/components/Pages/Privacy';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <PrivacyPage articles={data.contents} />
    </>
  );
}
