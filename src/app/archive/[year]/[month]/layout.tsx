import { notFound } from 'next/navigation';
import { DEFAULT_PREVIEW_IMAGE, getSiteUrl, getSiteTitle } from '@/config/site';
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
  if (!/^\d{4}$/.test(year) || !/^(0[1-9]|1[0-2])$/.test(month)) notFound();

  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `${year}年${parseInt(month)}月｜${defaultTitle}`;
  const description = `${year}年${parseInt(month)}月の記事一覧です。`;
  const images = `${defaultUrl}${DEFAULT_PREVIEW_IMAGE}`;
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

export default function ArchiveLayout(props: Props) {
  const { children } = props;

  return <>{children}</>;
}
