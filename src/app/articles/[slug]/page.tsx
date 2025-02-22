import { getDetail, getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import ArticlePage from '@/components/Pages/Article';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 60;

export default async function Page(props: Props) {
  const params = await props.params;

  const data = await getDetail(params.slug);
  const articles = await getList({
    limit: LIMIT,
    fields: 'id,title,thumbnail',
  });

  return (
    <>
      <ArticlePage articles={articles.contents} article={data} />
    </>
  );
}
