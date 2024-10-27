import React from 'react';
import { CalendarDaysIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    year: string;
    month: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { year, month } = params;

  return {
    title: `${year}年${parseInt(month)}月｜リアル大学生`,
    description: `${year}年${parseInt(month)}月の記事一覧です。`,
    openGraph: {
      title: `${year}年${parseInt(month)}月｜リアル大学生`,
      description: `${year}年${parseInt(month)}月の記事一覧です。`,
      images: `https://realunivlog.com/images/thumbnail/7.webp`,
      url: `https://realunivlog.com/archive/${year}/${month}`,
    },
    alternates: {
      canonical: `https://realunivlog.com/archive/${year}/${month}`,
    },
    robots: {
      index: false,
    },
  };
}

export default async function TagsLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const { year, month } = params;

  return (
    <>
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <nav className="flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <a href="/" className="flex text-gray-500 hover:text-blue-500">
                <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRightIcon
                  className="h-4 w-4 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <a
                  href={`/archive/${year}/${month}`}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  {year}月{parseInt(month)}月
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center pb-2 pt-2 mt-5">
          <CalendarDaysIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>
            {year}年{parseInt(month)}月
          </div>
        </div>
      </h1>
      <>{children}</>
    </>
  );
}
