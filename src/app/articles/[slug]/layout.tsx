import { Metadata } from 'next';
import { getDetail } from '@/libs/microcms';
import { PROFILE_NAME } from '@/constants/data';

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
      type: 'article',
      title: title,
      description: description,
      images: images,
      url: url,
      publishedTime: data.publishedAt,
      modifiedTime: data.updatedAt,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function ArticleLayout(props: Props) {
  const params = await props.params;
  const data = await getDetail(params.slug);
  const { children } = props;

  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;

  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.description,
    image: data.thumbnail.url,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt,
    author: {
      '@type': 'Person',
      name: PROFILE_NAME,
      url: `${defaultUrl}/profile`,
    },
    publisher: {
      '@type': 'Organization',
      name: defaultTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${defaultUrl}/images/head/realstudent.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${defaultUrl}/articles/${data.id}`,
    },
  };

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
        name: data.categories[0].name,
        item: `${defaultUrl}/category/${data.categories[0].id}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: data.title,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
