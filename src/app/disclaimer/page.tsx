import DisclaimerPage from '@/components/Pages/Disclaimer';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <DisclaimerPage articles={data.contents} />
    </>
  );
}
