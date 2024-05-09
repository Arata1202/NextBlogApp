import { getList } from '@/libs/microcms';
import Sidebar from '@/components/Sidebar';
import ContactPage from '@/components/Fixed/contact';

export const revalidate = 60;

export default async function Page() {
  return (
    <>
      <ContactPage />
      <div className="pc">
        <Sidebar />
      </div>
    </>
  );
}
