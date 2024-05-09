import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import SitemapPage from '@/components/Fixed/sitemap';

export const revalidate = 60;

export default async function Page() {
  return (
    <>
      <SitemapPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
