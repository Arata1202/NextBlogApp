import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import ProfilePage from '@/components/Pages/Profile';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <ProfilePage articles={data.contents} />
    </>
  );
}
