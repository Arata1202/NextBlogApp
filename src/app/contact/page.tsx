import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import ContactPage from '@/components/Pages/Contact';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });

  return (
    <>
      <ContactPage articles={data.contents} />
    </>
  );
}
