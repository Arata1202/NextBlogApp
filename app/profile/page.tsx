import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import ProfilePage from '@/components/Fixed/profile';

export const revalidate = 60;

export default async function Page() {
  return (
    <>
      <ProfilePage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
