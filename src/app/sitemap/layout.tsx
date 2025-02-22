import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const title = `サイトマップ｜${defaultTitle}`;
  const description = `当ブログのサイトマップを記載しています。`;
  const images = `${defaultUrl}/images/thumbnail/7.webp`;
  const url = `${defaultUrl}/sitemap`;

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

export default async function SitemapLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
