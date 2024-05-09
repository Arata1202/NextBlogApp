import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import PrivacyPage from '@/components/Fixed/privacy';

export const revalidate = 60;

export default async function Page() {
  return (
    <>
      <PrivacyPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
