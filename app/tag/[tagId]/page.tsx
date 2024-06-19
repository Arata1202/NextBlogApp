import { getList, getTag2 } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import Script from 'next/script';

type Props = {
  params: {
    tagId: string;
  };
};

export const revalidate = 60;

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const data = await getList({
    limit: LIMIT,
    filters: `tags2[contains]${tagId}`,
  });
  const data2 = await getList({
    limit: LIMIT,
  });
  const tag = await getTag2(tagId);
  return (
    <>
      <ArticleList articles={data.contents} allArticles={data2.contents} />
      <Pagination totalCount={data.totalCount} basePath={`/tag/${tagId}`} />
      <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-1705865999592590"
          data-ad-slot="7197259627"
          data-ad-format="auto"
          data-full-width-responsive="false"
        ></ins>
        <Script id="adsbygoogle-init" strategy="afterInteractive">
          {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
        </Script>
      </div>
      <div className="pc">
        <TopSidebar articles={data2.contents} />
      </div>
    </>
  );
}
