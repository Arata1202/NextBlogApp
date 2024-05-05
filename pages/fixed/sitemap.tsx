import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../pages.global.css';
import styles from '../index.module.css';
import SearchField from '@/components/SearchField';
import Image from 'next/image';
import PublishedDate from '@/components/Date';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react';
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { EnvelopeIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';

const ContactPage: React.FC = () => {
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
      <Head>
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
      </Head>

      <Header />
      <main className={styles.main}>
        <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto mt-20">
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="py-8">
                <div className="space-y-5 lg:space-y-8">
                  <div className="flex items-center">
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
                        <Link href="/fixed/contact" className="text-blue-500 hover:text-blue-700">
                          お問い合わせ
                        </Link>
                      </li>
                      <li>
                        <Link href="/fixed/sitemap" className="text-blue-500 hover:text-blue-700">
                          サイトマップ
                        </Link>
                      </li>
                      <li>
                        <Link href="/fixed/profile" className="text-blue-500 hover:text-blue-700">
                          プロフィール
                        </Link>
                      </li>
                      <li>
                        <Link href="/fixed/privacy" className="text-blue-500 hover:text-blue-700">
                          プライバシーポリシー
                        </Link>
                      </li>
                    </ul>
                    <h2>投稿一覧</h2>
                    <ul>
                      <li>
                        <Link href="/fixed/contact" className="text-blue-500 hover:text-blue-700">
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

            {/* Sidebar Area */}
            <div className="lg:col-span-1 lg:w-full lg:h-full">
              <div className="sidebar sticky top-0 start-0 lg:ps-8 py-7">
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold mb-5`}>
                    検索
                  </h1>
                  <SearchField />
                </div>
                {/* Profile Media */}
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold pb-5`}>
                    ブログ運営者
                  </h1>
                  <Image
                    className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                    src="/images/blog/face.webp"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h1 className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800">
                    <Link href="/fixed/profile" className="hover:text-blue-500">
                      リアル大学生｜あお
                    </Link>
                  </h1>
                  <div className="text-lg leading-6 text-gray-800 mt-5">
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>20歳</li>
                      <li>千葉県在住</li>
                      <li>文系大学生｜26卒</li>
                      <li>マーケティング学科</li>
                      <li>Webエンジニアインターンに参加（主にLaravelやVue.js）</li>
                      <li>プログラミングは大学生から開始。独学でPHPやJavaScriptなどを習得</li>
                    </ul>
                  </div>
                  <ul role="list" className="mt-6 flex justify-center gap-x-6">
                    <li>
                      <a
                        href="https://twitter.com/Aokumoblog"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <span className="sr-only">X</span>
                        <svg
                          className="h-8 w-8"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/ao_realstudent/?hl=ja"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg
                          className="h-8 w-8"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>
                    カテゴリー
                  </h1>
                  <nav className="grid gap-4 mt-5 md:mt-5" aria-label="Tabs" role="tablist">
                    <a
                      href="/tags/university"
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-3 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
                      id="tabs-with-card-item-1"
                      data-hs-tab="#tabs-with-card-1"
                      aria-controls="tabs-with-card-1"
                      role="tab"
                    >
                      <span className="flex">
                        <span className="grow">
                          <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                              <li>大学生活</li>
                            </ul>
                          </span>
                        </span>
                      </span>
                    </a>
                    <a
                      href="/tags/programming"
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-3 border-gray-300 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
                      id="tabs-with-card-item-1"
                      data-hs-tab="#tabs-with-card-1"
                      aria-controls="tabs-with-card-1"
                      role="tab"
                    >
                      <span className="flex">
                        <span className="grow">
                          <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                              <li>プログラミング</li>
                            </ul>
                          </span>
                        </span>
                      </span>
                    </a>
                  </nav>
                </div>

                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>
                    人気の投稿
                  </h1>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/2.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title font-bold">
                          【乳頭温泉郷】鶴の湯に宿泊！予約方法やアクセスについて解説
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/3.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title">
                          【文系】大学生必見！大学でのリアルな持ち物を大公開【かばんの中身】
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/8.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title">
                          【勉強法】１か月で習得！PHP学習のおすすめロードマップを紹介【プログラミング】
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                </div>
                {/* More sidebar content */}
              </div>
              {/* More sidebar content */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
