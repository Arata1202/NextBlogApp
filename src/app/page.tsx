import HomePage from '@/components/Pages/Home';
import { DESCRIPTION, PROFILE_NAME, SOCIAL_ICON } from '@/constants/data';
import { getHomePageData } from '@/libs/pageData';

export default async function Page() {
  const pageData = await getHomePageData(1);
  const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const defaultTitle = process.env.NEXT_PUBLIC_BASE_TITLE;
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${defaultUrl}#website`,
    name: defaultTitle,
    url: defaultUrl,
    description: DESCRIPTION,
    inLanguage: 'ja-JP',
    publisher: {
      '@type': 'Person',
      '@id': `${defaultUrl}/profile#person`,
      name: PROFILE_NAME,
      url: `${defaultUrl}/profile`,
      sameAs: SOCIAL_ICON.map((icon) => icon.path),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomePage {...pageData} />
    </>
  );
}
