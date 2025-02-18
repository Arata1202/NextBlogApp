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

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `${year}年${parseInt(month)}月｜${defaultTitle}`;
  const description = `${year}年${parseInt(month)}月の記事一覧です。`;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/archive/${year}/${month}`;

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

export default async function ArchiveLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
