import { getList } from '@/libs/microcms';
import { getArchiveStaticParams } from '@/libs/archive';
import { LIMIT } from '@/constants/limit';
import ArchivePage from '@/components/Pages/Archive';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    current: string;
    year: string;
    month: string;
  }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const archiveParams = await getArchiveStaticParams();

  const results = await Promise.all(
    archiveParams.map(async ({ year, month }) => {
      const startDate = `${year}-${month}-01T00:00:00Z`;
      const endDate = new Date(Date.UTC(Number(year), Number(month), 1)).toISOString();

      const data = await getList({
        limit: 0,
        fields: '',
        filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
      });

      const totalCount = data.totalCount;
      const totalPages = Math.ceil(totalCount / LIMIT);
      const currents = Array.from({ length: totalPages }, (_, i) => i + 1);

      return currents.map((current) => ({
        year,
        month: month,
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
  const endDate = new Date(Date.UTC(Number(year), Number(month), 1)).toISOString();

  const current = parseInt(params.current as string, 10);

  const [data, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: LIMIT * (current - 1),
      filters: `publishedAt[greater_than]${startDate}[and]publishedAt[less_than]${endDate}`,
    }),
    getSidebarData(),
  ]);
  const { recentArticles, tags, archiveList } = sidebarData;

  return (
    <>
      <ArchivePage
        year={year}
        month={month}
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
