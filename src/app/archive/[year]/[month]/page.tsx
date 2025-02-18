import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import ArchivePage from '@/components/Pages/Archive';

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Number(year), Number(month), 1).toISOString();

  const data = await getList({
    limit: LIMIT,
    filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
  });

  return (
    <>
      <ArchivePage
        year={year}
        month={month}
        articles={data.contents}
        totalCount={data.totalCount}
      />
    </>
  );
}
