import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import TopSidebar from '@/components/TopSidebar';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import Script from 'next/script';

export const revalidate = 60;

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });

  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 pb-2 max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="topTitle flex items-center pb-2 pt-2 mt-10">
          <BellAlertIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>最新記事</div>
        </div>
      </h1>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} />
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
        <TopSidebar articles={data.contents} />
      </div>
    </>
  );
}
