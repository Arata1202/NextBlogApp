import { serializeJsonLd } from '@/utils/jsonLd';
import { DEFAULT_PREVIEW_IMAGE, getSiteUrl, getSiteTitle } from '@/config/site';
import { Metadata } from 'next';

type Props = {
  children: React.ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();

  const title = `お問い合わせ｜${defaultTitle}`;
  const description = `お問い合わせのフォームを記載しています。`;
  const images = `${defaultUrl}${DEFAULT_PREVIEW_IMAGE}`;
  const url = `${defaultUrl}/contact`;

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

export default async function ContactLayout(props: Props) {
  const { children } = props;
  const defaultUrl = getSiteUrl();
  const defaultTitle = getSiteTitle();
  const contactUrl = `${defaultUrl}/contact`;
  const description = 'お問い合わせのフォームを記載しています。';
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
        name: 'お問い合わせ',
        item: contactUrl,
      },
    ],
  };
  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${contactUrl}#contactpage`,
    url: contactUrl,
    name: `お問い合わせ｜${defaultTitle}`,
    description,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${defaultUrl}#website`,
      name: defaultTitle,
      url: defaultUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(contactPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
