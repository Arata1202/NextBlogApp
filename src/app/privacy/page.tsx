import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import PrivacyPage from '@/components/Pages/Privacy';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <PrivacyPage articles={data.contents} />
    </>
  );
}
