import { getDetail, getList, getAllLists } from '@/libs/Microcms';
import { LIMIT } from '@/constants/Limit';
import ArticlePage from '@/components/Pages/Article';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async () => {
  const data = await getAllLists();

  return data.map((slug) => ({ slug: slug.id }));
};

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
