import { Metadata } from 'next';
import { getTag } from '@/libs/Microcms';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    tagId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const tag = await getTag(params.tagId, { fields: 'id,name' });

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${tag.name}｜${defaultTitle}`;
  const description = `${tag.name}について解説するタグです。`;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/tag/${tag.id}`;

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
    robots: {
      index: false,
    },
  };
}

export default async function TagsLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
