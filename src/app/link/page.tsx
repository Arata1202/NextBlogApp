import LinkPage from '@/components/Pages/Link';
import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <LinkPage articles={data.contents} />
    </>
  );
}
