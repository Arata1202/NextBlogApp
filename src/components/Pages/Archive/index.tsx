import { Article, Tag } from '@/types/microcms';
import { ArchiveItem } from '@/libs/archive';
import { YouTube } from '@/types/youtube';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import Pagination from '@/components/Common/Pagination';
import ArticleList from '@/components/Common/ArticleList';
import PageHeading from '@/components/Common/PageHeading';

type Props = {
  year: string;
  month: string;
  articles: Article[];
  totalCount: number;
  current?: number;
  recentArticles?: Article[];
  tags: Tag[];
  archiveList: ArchiveItem[];
  youtubeList: YouTube[];
};

export default function ArchivePage({
  year,
  month,
  articles,
  totalCount,
  current,
  recentArticles,
  tags,
  archiveList,
  youtubeList,
}: Props) {
  return (
    <>
      <PageHeading year={year} month={month} />
      <ArticleList
        articles={articles}
        recentArticles={recentArticles}
        tags={tags}
        archiveList={archiveList}
        youtubeList={youtubeList}
      />
      <Pagination
        totalCount={totalCount}
        current={current}
        basePath={`/archive/${year}/${month}`}
      />
      <AdUnit slot="5969933704" style={{ marginTop: '1.25rem' }} />
    </>
  );
}
