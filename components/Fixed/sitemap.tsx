import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { DocumentMagnifyingGlassIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import FixedSidebar from '@/components/FixedSidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import Display from '../Adsense/display';

const SitemapPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  //出稿日
  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
              <div className="FirstAd">
                <Display slot="7197259627" />
              </div>
              <div className="space-y-5 lg:space-y-8">
                <div className="includeBanner flex justify-end gap-x-5">
                  {/* <TagList tags={data.tags} /> */}
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
                <div className={`${styles.content} mt-10 mb-5`}>
                  <h2>固定ページ</h2>
                  <ul>
                    <li>
                      <Link href="/contact" className="text-blue-500 hover:text-blue-700">
                        お問い合わせ
                      </Link>
                    </li>
                    <li>
                      <Link href="/sitemap" className="text-blue-500 hover:text-blue-700">
                        サイトマップ
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="text-blue-500 hover:text-blue-700">
                        プロフィール
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="text-blue-500 hover:text-blue-700">
                        プライバシーポリシー
                      </Link>
                    </li>
                  </ul>
                  <h2>カテゴリー</h2>
                  <ul>
                    <li>
                      <Link
                        href="/category/programming"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        プログラミング
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/category/university"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        大学生活
                      </Link>
                    </li>
                  </ul>
                  <h2>投稿一覧</h2>
                  <ul>
                    {sidebarArticles.contents.map((article: any) => (
                      <li key={article.id}>
                        <Link
                          href={`/articles/${article.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Share />
              <div className="FirstAd">
                <Display slot="1831092739" />
              </div>
            </div>
          </div>
          <div className="mobile">
            <FixedSidebar articles={sidebarArticles.contents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;
