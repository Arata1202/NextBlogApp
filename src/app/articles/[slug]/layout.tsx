import { Metadata } from 'next';
import { getDetail } from '@/libs/microcms';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const data = await getDetail(params.slug);

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${data.title}｜${defaultTitle}`;
  const description = `${data.description}`;
  const images = `${data.thumbnail.url}`;
  const url = `${defaultUrl}/articles/${data.id}`;

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

export default async function ArticleLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
