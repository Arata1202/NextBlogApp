import { LIMIT } from '@/constants/limit';
import HomePage from '@/components/Pages/Home';
import { getHomeCollection, getHomePageData } from '@/libs/pageData';

type Props = {
  params: Promise<{
    current: string;
  }>;
};

export const metadata = {
  robots: {
    index: false,
  },
};

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const { articles } = await getHomeCollection();
  const totalPages = Math.ceil(articles.length / LIMIT);
  const currents = Array.from({ length: totalPages }, (_, i) => i + 1);

  return currents.map((current) => ({ current: current.toString() }));
};

export default async function Page(props: Props) {
  const params = await props.params;
  const current = parseInt(params.current as string, 10);

  const pageData = await getHomePageData(current);
  return <HomePage {...pageData} current={current} />;
}
