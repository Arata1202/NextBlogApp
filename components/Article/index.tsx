'use client';

import { formatRichText } from '@/libs/utils';
import { type Article } from '@/libs/microcms';
import PublishedDate from '../Date';
import styles from './index.module.css';
import TagList from '../TagList';
import Profile from '../Profile';
import SearchField from '../SearchField';

type Props = {
  data: Article;
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
    <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto mt-20">
      <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <div className="py-8 lg:pe-8">
            <div className="space-y-5 lg:space-y-8">
              <a
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
              </a>

              <h2 className="text-3xl font-bold lg:text-5xl">{data.title}</h2>

              <div className="flex items-center gap-x-5">
                <TagList tags={data.tags} />
                <PublishedDate date={data.publishedAt || data.createdAt} />
              </div>

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
          <div className="sticky top-0 start-0 py-8 lg:ps-8">
            {/* Profile Media */}
            <div className="rounded-2xl bg-white px-8 py-10">
              <img
                className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                src="/images/blog/face.jpg"
                alt=""
              />
              <h3 className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800">
                リアル大学生｜あお
              </h3>
              <p className="text-lg leading-6 text-gray-800 mt-5">
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                  <li>20歳</li>
                  <li>千葉県在住</li>
                  <li>文系大学生｜26卒</li>
                  <li>マーケティング学科</li>
                  <li>Webエンジニアインターンに参加（主にLaravelやVue.js）</li>
                  <li>プログラミングは大学生から開始。独学でPHPやJavaScriptなどを習得</li>
                </ul>
              </p>
              <ul role="list" className="mt-6 flex justify-center gap-x-6">
                <li>
                  <a href="/" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">X</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="/" className="text-gray-400 hover:text-gray-300">
                    <span className="sr-only">LinkedIn</span>
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            {/* More sidebar content */}
          </div>
        </div>
      </div>
    </div>
  );
}
