import { getList } from '@/libs/microcms';
import { getArchiveFilter, getArchiveStaticParams } from '@/libs/archive';
import { LIMIT } from '@/constants/limit';
import ArchivePage from '@/components/Pages/Archive';
import { getSidebarData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  return await getArchiveStaticParams();
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, month } = params;

  const [data, sidebarData] = await Promise.all([
    getList({
      limit: LIMIT,
      fields: 'id,title,description,publishedAt,updatedAt,thumbnail',
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
        recentArticles={recentArticles}
        totalCount={data.totalCount}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
