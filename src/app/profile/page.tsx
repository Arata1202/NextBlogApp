import { getList } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/limit';
import ProfilePage from '@/components/Pages/Profile';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <ProfilePage articles={data.contents} />
    </>
  );
}
