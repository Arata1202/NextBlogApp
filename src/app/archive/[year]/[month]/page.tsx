import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants/Limit';
import ArchivePage from '@/components/Pages/Archive';
import { ArchiveArray } from '@/constants/Blog/ArchiveArray';

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const generateStaticParams = async () => {
  return ArchiveArray.map(({ year, month }) => {
    const formattedMonth = month.padStart(2, '0');
    return {
      year,
      month: formattedMonth,
    };
  });
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Number(year), Number(month), 1).toISOString();

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,publishedAt,updatedAt,thumbnail',
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
        recentArticles={recentArticles.contents}
        totalCount={data.totalCount}
      />
    </>
  );
}
