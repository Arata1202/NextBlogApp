import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import FixedSidebar from '@/components/FixedSidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import Display from '../Adsense/display';

const ShopPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  //出稿日
  const dummyDate = new Date(2024, 6, 6);
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
                  <h2>ショップページ</h2>
                </div>
              </div>
              <div className="FirstAd">
                <Display slot="1831092739" />
              </div>
              <Share />
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

export default ShopPage;
