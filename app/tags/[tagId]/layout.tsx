import { getTag } from '@/libs/microcms';
import { FolderOpenIcon } from '@heroicons/react/24/solid';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: {
    tagId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag(params.tagId);

  return {
    title: `${tag.name}｜リアル大学生`,
    description: `${tag.name}について解説するカテゴリーです。`,
    openGraph: {
      title: `${tag.name}｜リアル大学生`,
      description: `${tag.name}について解説するカテゴリーです。`,
      images: `https://realunivlog.vercel.app/images/thumbnail/${tag.id}.webp`,
      url: `https://realunivlog.vercel.app/tags/${tag.id}`,
    },
  };
}

export default async function TagsLayout({ children, params }: Props) {
  const tag = await getTag(params.tagId);

  return (
    <div>
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="flex items-center pb-2 pt-2">
          <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>{tag.name}</div>
        </div>
      </h1>
      <div>{children}</div>
    </div>
  );
}
