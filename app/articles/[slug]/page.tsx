import React from 'react';
import { Metadata } from 'next';
import { getDetail, getList } from '@/libs/microcms';
import Article from '@/components/Articles/Article';
import { LIMIT } from '@/constants';
import Display from '@/components/Adsense/display';

type Props = {
  params: {
    slug: string;
  };
  searchParams: {
    dk: string;
  };
};

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
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

export default async function Page({ params, searchParams }: Props) {
  const data = await getDetail(params.slug, {
    draftKey: searchParams.dk,
  });
  const data2 = await getList({
    limit: LIMIT,
  });

  return (
    <>
      <Article data={data} articles={data2.contents} />
      <Display slot="5969933704" />
    </>
  );
}
