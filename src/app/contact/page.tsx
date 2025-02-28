import { getList } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/Limit';
import ContactPage from '@/components/Pages/Contact';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <ContactPage articles={data.contents} />
    </>
  );
}
