import { Metadata } from 'next';
import { getList } from '@/libs/microcms';
import { LIMIT, RECENT_LIMIT } from '@/constants';
import SearchPage from '@/components/Pages/Search';

type Props = {
  params: Promise<{
    current: string;
  }>;
  searchParams: Promise<{
    q?: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const keyword = searchParams.q;

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `検索結果：${keyword}｜${defaultTitle}`;
  const description = `${keyword}の検索結果です。`;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/search?q=/${keyword}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      url: url,
    },
    robots: {
      index: false,
    },
  };
}

export const revalidate = 60;

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.q;

  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const data = await getList({
    limit: LIMIT,
    fields: 'id,title,description,thumbnail,publishedAt,updatedAt',
    offset: LIMIT * (current - 1),
    q: searchParams.q,
  });
  const recentArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <SearchPage
        articles={data.contents}
        totalCount={data.totalCount}
        current={current}
        recentArticles={recentArticles.contents}
        keyword={keyword}
      />
    </>
  );
}
