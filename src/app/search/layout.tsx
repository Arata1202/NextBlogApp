import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `検索結果｜${defaultTitle}`;
  const description = '検索結果を表示するページです。';
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/search`;

  return {
    title,
    description,
    robots: {
      index: false,
    },
    openGraph: {
      title,
      description,
      images,
      url,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function SearchLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
