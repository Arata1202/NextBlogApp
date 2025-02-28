import { getList } from '@/libs/Microcms';
import { RECENT_LIMIT } from '@/constants/Limit';
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
