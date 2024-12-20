import React from 'react';
import { getCategory } from '@/libs/microcms';
import { FolderOpenIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    tagId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const tag = await getCategory(params.tagId);

  return {
    title: `${tag.name}｜リアル大学生`,
    description: `${tag.name}について解説するカテゴリーです。`,
    openGraph: {
      title: `${tag.name}｜リアル大学生`,
      description: `${tag.name}について解説するカテゴリーです。`,
      images: `https://realunivlog.com/images/thumbnail/7.webp`,
      url: `https://realunivlog.com/category/${tag.id}`,
    },
    alternates: {
      canonical: `https://realunivlog.com/category/${tag.id}`,
    },
  };
}

export default async function TagsLayout(props: Props) {
  const params = await props.params;

  const { children } = props;

  const tag = await getCategory(params.tagId);

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
                  href={`${tag.id}`}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                >
                  {tag.name}
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex items-center pb-2 pt-2 mt-5">
          <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>{tag.name}</div>
        </div>
      </h1>
      <>{children}</>
    </>
  );
}
