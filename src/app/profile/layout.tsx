import { serializeJsonLd } from '@/utils/jsonLd';
import { DEFAULT_PREVIEW_IMAGE, getSiteUrl, getSiteTitle } from '@/config/site';
import { Metadata } from 'next';
import { PROFILE_IMAGE, PROFILE_NAME, SOCIAL_ICON } from '@/constants/data';

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `プロフィール｜${defaultTitle}`;
  const description = `筆者のプロフィールを紹介しています。`;
  const images = `${defaultUrl}${DEFAULT_PREVIEW_IMAGE}`;
  const url = `${defaultUrl}/profile`;

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

export default async function ProfileLayout(props: Props) {
  const { children } = props;
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();
  const profileUrl = `${defaultUrl}/profile`;
  const description = '筆者のプロフィールを紹介しています。';
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: defaultUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'プロフィール',
        item: profileUrl,
      },
    ],
  };
  const profilePageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${profileUrl}#profilepage`,
    url: profileUrl,
    name: `プロフィール｜${defaultTitle}`,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${defaultUrl}#website`,
      name: defaultTitle,
      url: defaultUrl,
    },
    mainEntity: {
      '@type': 'Person',
      '@id': `${profileUrl}#person`,
      name: PROFILE_NAME,
      url: profileUrl,
      image: PROFILE_IMAGE[0] ? `${defaultUrl}${PROFILE_IMAGE[0].path}` : undefined,
      sameAs: SOCIAL_ICON.map((icon) => icon.path),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(profilePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
