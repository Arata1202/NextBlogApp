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

  const products = [
    {
      id: 1,
      name: 'エコバッグ',
      color: 'Natural',
      price: '1000円 （税込）',
      href: '#',
      imageSrc: '/images/head/realstudent512.png',
      imageAlt: 'Hand stitched, orange エコバッグ.',
    },
    {
      id: 2,
      name: 'エコバッグ',
      color: 'Natural',
      price: '1000円 （税込）',
      href: '#',
      imageSrc: '/images/head/realstudent512.png',
      imageAlt: 'Hand stitched, orange エコバッグ.',
    },
    {
      id: 3,
      name: 'エコバッグ',
      color: 'Natural',
      price: '1000円 （税込）',
      href: '#',
      imageSrc: '/images/head/realstudent512.png',
      imageAlt: 'Hand stitched, orange エコバッグ.',
    },
    {
      id: 4,
      name: 'エコバッグ',
      color: 'Natural',
      price: '1000円 （税込）',
      href: '#',
      imageSrc: '/images/head/realstudent512.png',
      imageAlt: 'Hand stitched, orange エコバッグ.',
    },
  ];

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
                <div className="mt-10 mb-5 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                  {products.map((product) => (
                    <div key={product.id} className="group relative">
                      <div className="w-full bg-gray-200">
                        <img
                          alt={product.imageAlt}
                          src={product.imageSrc}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="mt-2 text-lg font-bold text-gray-700">
                        <a href={product.href}>
                          <span className="absolute inset-0" />
                          {product.name}
                        </a>
                      </div>
                      <div className="mb-2 mt-1 text-lg text-gray-900">{product.price}</div>
                    </div>
                  ))}
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
