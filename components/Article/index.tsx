'use client';

import { formatRichText } from '@/libs/utils';
import { type Article } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import TagList from '../TagList';
import Profile from '../Profile';
import SearchField from '../SearchField';
import ArticleListItem from '../ArticleListItem';
import Image from 'next/image';

type Props = {
  data: Article;
  articles?: Article[];
};

export default function Article({ data }: Props) {
  return (
    // <main className={styles.main}>
    //   <h1 className={styles.title}>{data.title}</h1>
    //   <TagList tags={data.tags} />
    //   <p className={styles.description}>{data.description}</p>
    //   <div className={styles.meta}>
    //     {data.writer && (
    //       <div className={styles.writer}>
    //         <picture>
    //           <source
    //             type="image/webp"
    //             srcSet={`${data.writer?.image?.url}?fm=webp&fit=crop&w=48&h=48 1x, ${data.writer?.image?.url}?fm=webp&fit=crop&w=48&h=48&dpr=2 2x`}
    //           />
    //           <img
    //             src={data.writer?.image?.url}
    //             alt=""
    //             className={styles.writerIcon}
    //             width={data.writer?.image?.width}
    //             height={data.writer?.image?.height}
    //           />
    //         </picture>
    //         <span className={styles.writerName}>{data.writer?.name}</span>
    //       </div>
    //     )}
    //     <PublishedDate date={data.publishedAt || data.createdAt} />
    //   </div>
    //   {/* <picture>
    //     <source
    //       type="image/webp"
    //       media="(max-width: 640px)"
    //       srcSet={`${data.thumbnail?.url}?fm=webp&w=414 1x, ${data.thumbnail?.url}?fm=webp&w=414&dpr=2 2x`}
    //     />
    //     <source
    //       type="image/webp"
    //       srcSet={`${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504 1x, ${data.thumbnail?.url}?fm=webp&fit=crop&w=960&h=504&dpr=2 2x`}
    //     />
    //     <img
    //       src={data.thumbnail?.url}
    //       alt=""
    //       className={styles.thumbnail}
    //       width={data.thumbnail?.width}
    //       height={data.thumbnail?.height}
    //     />
    //   </picture> */}
    //   <div
    //     className={styles.content}
    //     dangerouslySetInnerHTML={{
    //       __html: `${formatRichText(data.content)}`,
    //     }}
    //   />
    //   <Profile writer={data.writer} />
    // </main>
    <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto mt-20">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              {/* <a
                className="inline-flex items-center gap-x-1.5 text-sm text-gray-600 decoration-2 hover:underline"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                戻る
              </a> */}

              <h1 className="text-3xl font-bold lg:text-3xl">{data.title}</h1>

              <div className="includeBanner flex justify-end gap-x-5">
                {/* <TagList tags={data.tags} /> */}
                <PublishedDate date={data.publishedAt || data.createdAt} />
              </div>
              <p className="includeBanner text-center border p-3">記事内に広告が含まれています。</p>

              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: `${formatRichText(data.content)}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 lg:w-full lg:h-full">
          <div className="sidebar sticky top-0 start-0 lg:ps-8 py-8">
            <div className="rounded-2xl bg-white px-8 border py-5">
              <h1 className={`${styles.profile} text-2xl text-center font-semibold mb-5`}>検索</h1>
              <SearchField />
            </div>
            {/* Profile Media */}
            <div className="rounded-2xl bg-white px-8 border py-5 mt-5">
              <h1 className={`${styles.profile} text-2xl text-center font-semibold pb-5`}>
                この記事を書いた人
              </h1>
              <Image
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src="/images/blog/face.jpg"
                alt=""
                width={100}
                height={100}
              />
              <h1 className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800">
                <a href="" className="hover:text-blue-500">
                  リアル大学生｜あお
                </a>
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
            <div className="rounded-2xl bg-white px-8 border py-5 mt-5">
              <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>カテゴリー</h1>
              <nav className="grid gap-4 mt-5 md:mt-5" aria-label="Tabs" role="tablist">
                <a
                  href="/tags/university"
                  className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:border-blue-500 p-4 md:p-3 rounded-xl border"
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
                  className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:border-blue-500 p-4 md:p-3 rounded-xl border"
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

            {/* More sidebar content */}
          </div>
        </div>
      </div>
    </div>
  );
}
