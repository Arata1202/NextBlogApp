'use client';

import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { InformationCircleIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import FixedSidebar from '@/components/FixedSidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import TableOfContents from '../TableOfContent';
import Display from '../Adsense/display';

const CopyrightPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  // const headings = [
  //   { id: 'introduction', title: '個人情報取り扱いに関する基本方針', level: 2 },
  //   { id: 'definition', title: '個人情報の定義', level: 2 },
  //   { id: 'acquisition', title: '個人情報の取得方法', level: 2 },
  //   { id: 'cookie', title: 'クッキー（Cookie）', level: 3 },
  //   { id: 'analytics', title: 'アクセス解析ツール', level: 3 },
  //   { id: 'comment', title: 'コメントについて', level: 3 },
  //   { id: 'purpose', title: '個人情報の利用目的', level: 2 },
  //   { id: 'advertisement', title: '本サービスが利用している広告サービス', level: 2 },
  //   { id: 'amazon', title: 'Amazonアソシエイトプログラム', level: 3 },
  //   { id: 'google', title: 'Googleアドセンス', level: 3 },
  //   { id: 'management', title: '個人情報の管理方法', level: 2 },
  //   { id: 'third-party', title: '個人情報の第三者提供', level: 2 },
  //   { id: 'disclosure', title: '個人情報の開示、訂正などの手続きについて', level: 2 },
  //   { id: 'disclaimer', title: '免責事項', level: 2 },
  //   { id: 'copyright', title: '著作権について', level: 2 },
  //   { id: 'link', title: 'リンクについて', level: 2 },
  //   { id: 'contact', title: '個人情報の取扱いに関する相談や苦情の連絡先', level: 2 },
  // ];

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
            <div className="FirstAd">
              <Display slot="7197259627" />
            </div>
            <div className="">
              <div className="space-y-5 lg:space-y-8">
                <div className="includeBanner flex justify-end gap-x-5">
                  {/* <TagList tags={data.tags} /> */}
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
              </div>
              {/* <TableOfContents headings={headings} /> */}
              <div className={`${styles.content} mt-10 mb-5`}>
                <h2 id="copyright">著作権について</h2>
                <p>
                  本サービスのコンテンツ（写真や画像、文章など）の著作権につきましては、
                  原則として本サービスに帰属しており、無断転載することを禁止します。
                  <br />
                  <br />
                  本サービスのコンテンツを利用したい場合は、別途お問い合わせください。
                </p>
              </div>
            </div>
            <div className="FirstAd">
              <Display slot="1831092739" />
            </div>
            <Share />
          </div>
          <div className="mobile">
            <FixedSidebar articles={sidebarArticles.contents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyrightPage;
