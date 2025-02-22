import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
import ArchivePage from '@/components/Pages/Archive';

type Props = {
  params: Promise<{
    current: string;
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
