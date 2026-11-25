import { DEFAULT_PREVIEW_IMAGE, getSiteUrl, getSiteTitle } from '@/config/site';
import { Metadata } from 'next';
import { getTagForPage, taxonomyFields } from '@/libs/microcmsPage';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    tagId: string;
  }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const tag = await getTagForPage(params.tagId, taxonomyFields);

  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `${tag.name}｜${defaultTitle}`;
  const description = `${tag.name}について解説するタグです。`;
  const images = `${defaultUrl}${DEFAULT_PREVIEW_IMAGE}`;
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
