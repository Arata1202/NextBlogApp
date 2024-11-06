'use client';
import { useTheme } from 'next-themes';
import styles from './index.module.css';
import PublishedDate from '@/components/Elements/Date';
import React from 'react';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';
import Share from '../../Elements/Share';
import AdAlert from '../../Articles/Elements/AdAlert';
import Display from '../../Adsense/Display';

const CopyrightPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const { theme } = useTheme();

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
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
              </div>
              <div className={`${styles.content} mt-10 mb-5`}>
                <h2
                  className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                  id="copyright"
                >
                  著作権について
                </h2>
                <p>
                  リアル大学生（以下、「本サービス」と言います。）のコンテンツ（写真や画像、文章など）の著作権につきましては、
                  原則として本サービスに帰属しており、無断転載することを禁止します。
                  <br />
                  <br />
                  本サービスのコンテンツを利用したい場合は、別途お問い合わせください。
                  <br />
                  <br />
                  本サービスは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、
                  <a href="/contact">お問い合わせ</a>
                  よりご連絡ください。迅速に対応いたします。
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
