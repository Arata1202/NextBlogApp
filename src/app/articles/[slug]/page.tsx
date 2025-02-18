import { Metadata } from 'next';
import { getDetail, getList } from '@/libs/microcms';
import Article from '@/components/Articles/Article';
import { LIMIT } from '@/constants';
import Display from '@/components/Adsense/Display';

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    dk: string;
  }>;
};

export const revalidate = 60;

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getDetail(params.slug, {
    draftKey: searchParams.dk,
  });

  return {
    title: data.title + '｜リアル大学生',
    description: data.description,
    openGraph: {
      title: data.title + '｜リアル大学生',
      description: data.description,
      images: [data?.thumbnail?.url || ''],
      url: 'https://realunivlog.com/articles/' + data.id,
    },
    alternates: {
      canonical: 'https://realunivlog.com/articles/' + data.id,
    },
  };
}

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const data = await getDetail(params.slug, {
    draftKey: searchParams.dk,
  });
  const data2 = await getList({
    limit: LIMIT,
  });

  return (
    <>
      <Article data={data} articles={data2.contents} />
      <div className="mt-5">
        <Display slot="5969933704" />
      </div>
    </>
  );
}
