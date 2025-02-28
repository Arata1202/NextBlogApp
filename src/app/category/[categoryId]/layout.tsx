import { getCategory } from '@/libs/Microcms';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    categoryId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const category = await getCategory(params.categoryId, { fields: 'id,name' });

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${category.name}｜${defaultTitle}`;
  const description = `${category.name}について解説するカテゴリーです。`;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/category/${category.id}`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: images,
      url: url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
