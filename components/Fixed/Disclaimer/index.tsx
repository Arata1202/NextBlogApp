'use client';
import { useTheme } from 'next-themes';
import styles from './index.module.css';
import PublishedDate from '@/components/Elements/Date';
import React from 'react';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';
import Share from '../../Elements/Share';
import AdAlert from '../../Articles/Elements/AdAlert';
import Display from '../../Adsense/Display';

const DisclaimerPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
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
            {/* <div className="FirstAd">
              <Display slot="7197259627" />
            </div> */}
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
                  id="disclaimer"
                >
                  免責事項
                </h2>
                <p>
                  リアル大学生（以下、「本サービス」と言います。）からのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。
                  <br />
                  <br />
                  また本サービスのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。
                  <br />
                  <br />
                  本サービスに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
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

export default DisclaimerPage;
