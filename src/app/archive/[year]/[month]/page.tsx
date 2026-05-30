import { getList } from '@/libs/microcms';
import { getArchiveStaticParams } from '@/libs/archive';
import { LIMIT } from '@/constants/limit';
import ArchivePage from '@/components/Pages/Archive';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const generateStaticParams = async () => {
  return await getArchiveStaticParams();
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const startDate = `${year}-${month}-01T00:00:00Z`;
  const endDate = new Date(Date.UTC(Number(year), Number(month), 1)).toISOString();

  const [data, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,publishedAt,updatedAt,thumbnail',
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
        recentArticles={recentArticles}
        totalCount={data.totalCount}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
