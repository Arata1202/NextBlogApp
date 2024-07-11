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
    // {
    //   id: 1,
    //   name: 'アクリルキーホルダー',
    //   price: '999円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/acrylic-keychain/50x50mm/clear',
    //   imageSrc: '/images/shop/1720359991-512x512.webp',
    //   imageAlt: 'アクリルキーホルダー',
    // },
    // {
    //   id: 2,
    //   name: 'ステッカー',
    //   price: '512円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/sticker/m/white',
    //   imageSrc: '/images/shop/sticker.webp',
    //   imageAlt: 'ステッカー',
    // },
    // {
    //   id: 3,
    //   name: 'アクリルスタンド',
    //   price: '1446円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/acrylic-stand/50mm/clear',
    //   imageSrc: '/images/shop/スタンド.webp',
    //   imageAlt: 'アクリルスタンド',
    // },
    // {
    //   id: 4,
    //   name: 'エコバッグ',
    //   price: '2563円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/reusable-bag/m/white',
    //   imageSrc: '/images/shop/エコバッグ.webp',
    //   imageAlt: 'エコバッグ',
    // },
    // {
    //   id: 5,
    //   name: 'スタンダードTシャツ',
    //   price: '3476円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/t-shirt/s/white',
    //   imageSrc: '/images/shop/tシャツ.webp',
    //   imageAlt: 'スタンダードTシャツ',
    // },
    // {
    //   id: 6,
    //   name: 'クリアファイル',
    //   price: '1180円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/clear-file-folder/a4/clear',
    //   imageSrc: '/images/shop/クリアファイル.webp',
    //   imageAlt: 'クリアファイル',
    // },
    // {
    //   id: 7,
    //   name: 'ノート',
    //   price: '1892円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/note/m/white',
    //   imageSrc: '/images/shop/ノート.webp',
    //   imageAlt: 'ノート',
    // },
    // {
    //   id: 8,
    //   name: 'ソフトクリアケース',
    //   price: '2233円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/soft-clear-smartphone-case/iphone15/clear',
    //   imageSrc: '/images/shop/ソフトクリアスマホケース.webp',
    //   imageAlt: 'ソフトクリアスマホケース',
    // },
    // {
    //   id: 9,
    //   name: 'クリアケース',
    //   price: '2233円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/clear-smartphone-case/iphone15/clear',
    //   imageSrc: '/images/shop/クリアケース.webp',
    //   imageAlt: 'クリアスマホケース',
    // },
    // {
    //   id: 10,
    //   name: 'スマホケース',
    //   price: '2453円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/smartphone-case/iphone15/white',
    //   imageSrc: '/images/shop/スマホケース.webp',
    //   imageAlt: 'スマホケース',
    // },
    {
      id: 1,
      name: 'ワンポイントTシャツ',
      price: '2750円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/one-point-t-shirt/l/white',
      imageSrc: '/images/shop/ワンポイントTシャツ.webp',
      imageAlt: 'ワンポイントTシャツ',
    },
    {
      id: 2,
      name: 'スマホストラップ',
      price: '1496円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/smartphone-strap/free/black',
      imageSrc: '/images/shop/スマホストラップ.webp',
      imageAlt: 'スマホストラップ',
    },
    {
      id: 3,
      name: 'マルチケース',
      price: '1606円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/clear-multi-case/m/clear',
      imageSrc: '/images/shop/クリアマルチケース.webp',
      imageAlt: 'クリアマルチケース',
    },
    {
      id: 4,
      name: 'ミニマルチケース',
      price: '1386円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/mini-clear-multi-case/m/clear',
      imageSrc: '/images/shop/ミニクリアマルチケース.webp',
      imageAlt: 'ミニクリアマルチケース',
    },
    {
      id: 5,
      name: 'ランチトートバッグ',
      price: '1980円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/lunch-tote-bag/s/white',
      imageSrc: '/images/shop/ランチトートバッグ.webp',
      imageAlt: 'ランチトートバッグ',
    },
    {
      id: 6,
      name: 'トートバッグ',
      price: '2640円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/tote-bag/m/white',
      imageSrc: '/images/shop/トートバッグ.webp',
      imageAlt: 'トートバッグ',
    },
    {
      id: 7,
      name: '缶バッジ',
      price: '792円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/can-badge/75mm/white',
      imageSrc: '/images/shop/缶バッジ.webp',
      imageAlt: '缶バッジ',
    },
    {
      id: 8,
      name: 'ステッカー',
      price: '512円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/sticker/m/white',
      imageSrc: '/images/shop/ステッカー透過.webp',
      imageAlt: 'ステッカー',
    },
    {
      id: 9,
      name: 'アクリルキーホルダー',
      price: '999円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/acrylic-keychain/50x50mm/clear',
      imageSrc: '/images/shop/アクリルキーホルダー.webp',
      imageAlt: 'アクリルキーホルダー',
    },
    {
      id: 10,
      name: 'クッション',
      price: '3850円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/cushion/free/white',
      imageSrc: '/images/shop/クッション.webp',
      imageAlt: 'クッション',
    },
    {
      id: 11,
      name: 'ドッグTシャツ',
      price: '4290円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/dog-t-shirt/l/gray',
      imageSrc: '/images/shop/ドッグTシャツ.webp',
      imageAlt: 'ドッグTシャツ',
    },
    {
      id: 12,
      name: 'タオルハンカチ',
      price: '1565円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/towel-handkerchief/l/white',
      imageSrc: '/images/shop/タオルハンカチ.webp',
      imageAlt: 'タオルハンカチ',
    },
    {
      id: 13,
      name: 'バンダナ',
      price: '2310円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/bandana/m/white',
      imageSrc: '/images/shop/バンダナ.webp',
      imageAlt: 'バンダナ',
    },
    {
      id: 14,
      name: 'ジップパーカー',
      price: '5181円 （税込）',
      href: 'https://suzuri.jp/realunivlog/16206903/zip-hoodie/s/white',
      imageSrc: '/images/shop/ジップパーカー.webp',
      imageAlt: 'ジップパーカー',
    },
    // {
    //   id: 15,
    //   name: 'ヘビーウェイトジップパーカー',
    //   price: '7426円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16206903/heavyweight-zip-hoodie/l/offwhite',
    //   imageSrc: '/images/shop/ヘビーウェイトジップパーカー.webp',
    //   imageAlt: 'ヘビーウェイトジップパーカー',
    // },
    // {
    //   id: 1,
    //   name: 'アクリルキーホルダー',
    //   price: '999円 （税込）',
    //   href: 'https://suzuri.jp/realunivlog/16207027/acrylic-keychain/50x50mm/clear',
    //   imageSrc: '/images/shop/1720359991-512x512.webp',
    //   imageAlt: 'アクリルキーホルダー',
    // },
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
                <p className="mt-5">
                  <a
                    href="https://suzuri.jp/realunivlog"
                    className="text-blue-500 hover:text-blue-700"
                    target={'_blank'}
                  >
                    SUZURI
                  </a>
                  にてオリジナルグッズを販売しております。以下はピックアップした商品です。ぜひ一度ご覧ください。
                </p>
                <div className="mt-10 mb-5 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
                  {products.map((product) => (
                    <div key={product.id} className="mt-10 mb-5">
                      <div className="group relative">
                        <div className="w-full bg-gray-200">
                          <img
                            alt={product.imageAlt}
                            src={product.imageSrc}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="mt-2 text-lg font-bold text-gray-700">
                          <>
                            <span className="absolute inset-0" />
                            {product.name}
                          </>
                        </div>
                        <div className="mt-1 text-lg text-gray-900">{product.price}</div>
                      </div>
                      <div className="mt-2">
                        <a
                          href={product.href}
                          target="_blank"
                          className="block w-full rounded-md bg-white px-3.5 py-1.5 text-center text-sm font-semibold text-gray-800 shadow-s border border-gray-300 hover:text-blue-500"
                        >
                          詳細を見る
                        </a>
                      </div>
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
