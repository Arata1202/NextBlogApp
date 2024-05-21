import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';
import Head from 'next/head';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

const SitemapPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  //出稿日
  const dummyDate = new Date(2024, 4, 4);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div>
      <Header />
      <main className={styles.main}>
        <div className=" categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
          <div className="flex items-center py-2 mt-2">
            <DocumentMagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            <h1 className="text-3xl font-bold lg:text-3xl">サイトマップ</h1>
          </div>
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 mb-20">
              <div className="">
                <div className="space-y-5 lg:space-y-8">
                  <div className="includeBanner flex justify-end gap-x-5">
                    {/* <TagList tags={data.tags} /> */}
                    <PublishedDate date={formattedDate} />
                  </div>
                  {/* <p className="includeBanner text-center border border-gray-300 p-3">
                    記事内に広告が含まれています。
                  </p> */}
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
                        <Link
                          href="https://realunivlog.com/articles/study-javascript-recommend-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【勉強法】最速！JavaScript学習のおすすめロードマップを紹介【プログラミング】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/engineer-intern-application-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【未経験可能】エンジニアインターンの応募方法や注意点について解説【現役大学生】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/seminar-select-attention"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【ゼミとは何？】大学生のゼミの選び方の注意点について解説【文系大学生】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/after-get-license-should-drive"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          免許を取ったらすぐに運転練習をするべき理由について解説【現役大学生】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/university-student-real-personal-effects"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【文系】大学生必見！大学でのリアルな持ち物を大公開【かばんの中身】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/example-inexperience-become-engineer-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【最短】未経験がエンジニアになるまでのロードマップを紹介【プログラミング】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/study-python-recommend-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【勉強法】２週間で習得！Python学習のおすすめロードマップを解説【プログラミング】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/nyuto-hotspring-tsurunoyu-reservation-access"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【乳頭温泉郷】鶴の湯に宿泊！予約方法やアクセスについて解説
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/reality-portfolio-example-make-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【実物あり】ポートフォリオの作り方を例として解説【大学生エンジニア】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/study-php-recommend-method"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【勉強法】１か月で習得！PHP学習のおすすめロードマップを紹介【プログラミング】
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="https://realunivlog.com/articles/student-should-get-car-license"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          【いつ取るの？】大学生の間に運転免許を取得するべき理由について解説【現役大学生】
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
                  </div>
                </div>
              </div>
            </div>
            <div className="mobile">
              <Sidebar articles={sidebarArticles.contents} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SitemapPage;
