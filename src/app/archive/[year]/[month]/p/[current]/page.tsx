import { getList } from '@/libs/Microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/Limit';
import ArchivePage from '@/components/Pages/Archive';
import { ArchiveObject } from '@/constants/Blog/ArchiveObject';

type Props = {
  params: Promise<{
    current: string;
    year: string;
    month: string;
  }>;
};

export const generateStaticParams = async () => {
  const results = await Promise.all(
    ArchiveObject.map(async ({ year, month }) => {
      const formattedMonth = month.padStart(2, '0');
      const startDate = `${year}-${formattedMonth}-01T00:00:00Z`;
      const endDate = new Date(Number(year), Number(formattedMonth), 1).toISOString();

      const data = await getList({
        limit: 0,
        fields: '',
        filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
      });

      const totalCount = data.totalCount;
      const currents = Array.from({ length: totalCount }, (_, i) => i + 1);

      return currents.map((current) => ({
        year,
        month: formattedMonth,
        current: current.toString(),
      }));
    }),
  );

  return results.flat();
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Number(year), Number(month), 1).toISOString();

  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    offset: LIMIT * (current - 1),
    filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <ArchivePage
        year={year}
        month={month}
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles.contents}
      />
    </>
  );
}
