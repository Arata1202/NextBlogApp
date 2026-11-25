import { getList } from '@/libs/microcms';
import { getArchiveFilter, getArchivePageParams } from '@/libs/archive';
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

export const generateStaticParams = () => getArchivePageParams(LIMIT);

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const current = parseInt(params.current as string, 10);

  const [data, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
      offset: LIMIT * (current - 1),
      filters: getArchiveFilter(year, month),
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
