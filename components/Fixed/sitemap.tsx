import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const SitemapPage: React.FC = () => {
  //出稿日
  const dummyDate = new Date(2024, 4, 4);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div>
      {/* プロフィール */}
      {/* <Head>
        <title>サイトマップ</title>
        <meta
          name="description"
          content="あなたのサイトのお問い合わせページです。ご質問やご意見があれば、お気軽にお問い合わせください。"
        />
        <meta property="og:title" content="お問い合わせ - あなたのサイト名" />
        <meta
          property="og:description"
          content="あなたのサイトのお問い合わせページです。ご質問やご意見があれば、お気軽にお問い合わせください。"
        />
        <meta property="og:image" content="アイキャッチ画像のURL" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}

      <Header />
      <main className={styles.main}>
        <div className=" categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="">
                <div className="space-y-5 lg:space-y-8">
                  <div className="flex items-center py-2">
                    <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                    <h1 className="text-3xl font-bold lg:text-3xl">サイトマップ</h1>
                  </div>
                  <div className="includeBanner flex justify-end gap-x-5">
                    {/* <TagList tags={data.tags} /> */}
                    <PublishedDate date={formattedDate} />
                  </div>
                  <p className="includeBanner text-center border border-gray-300 p-3">
                    記事内に広告が含まれています。
                  </p>
                  <div className={`${styles.content} mt-10`}>
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
                    <h2>投稿一覧</h2>
                    <ul>
                      <li>
                        <Link href="/contact" className="text-blue-500 hover:text-blue-700">
                          例
                        </Link>
                      </li>
                    </ul>
                    <h2>カテゴリー</h2>
                    <ul>
                      <li>
                        <Link
                          href="/article/programming"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          プログラミング
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/article/university"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          大学生活
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <Sidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitemapPage;