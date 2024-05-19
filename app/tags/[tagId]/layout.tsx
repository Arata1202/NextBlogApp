import { getTag } from '@/libs/microcms';
import { FolderOpenIcon } from '@heroicons/react/24/solid';

type Props = {
  children: React.ReactNode;
  params: {
    tagId: string;
  };
};

// 未検証
let metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'カテゴリー｜リアル大学生',
  description: 'カテゴリー記事を解説するページです。',
  openGraph: {
    title: 'カテゴリー｜リアル大学生',
    description: 'カテゴリー記事を解説するページです。',
    images: '/',
    url: '/',
  },
  // alternates: {
  //   canonical: '/',
  // },
};

export default async function TagsLayout({ children, params }: Props) {
  const { tagId } = params;
  const tag = await getTag(tagId);

  metadata = {
    metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
    title: `${tag.name}｜リアル大学生`,
    description: `${tag.name}について解説するカテゴリーです。`,
    openGraph: {
      title: `${tag.name}｜リアル大学生`,
      description: `${tag.name}について解説するカテゴリーです。`,
      images: `https://realunivlog.vercel.app/images/thumbnail/${tag.id}.webp`,
      url: `https://realunivlog.vercel.app/tags/${tag.id}`,
    },
    // alternates: {
    //   canonical: `https://realunivlog.vercel.app/tags/${tag.id}`,
    // },
  };

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

export { metadata };
