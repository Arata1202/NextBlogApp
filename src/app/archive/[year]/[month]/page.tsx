import { getList, getAllTagLists } from '@/libs/microcms';
import { getArchiveStaticParams, getArchiveList } from '@/libs/archive';
import { LIMIT, RECENT_LIMIT } from '@/constants/limit';
import ArchivePage from '@/components/Pages/Archive';

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
  const tags = await getAllTagLists({
    fields: 'id,name',
  });
  const archiveList = await getArchiveList();

  return (
    <>
      <ArchivePage
        year={year}
        month={month}
        articles={data.contents}
        recentArticles={recentArticles.contents}
        totalCount={data.totalCount}
        tags={tags}
        archiveList={archiveList}
      />
    </>
  );
}
