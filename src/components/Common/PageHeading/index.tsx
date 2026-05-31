import styles from './index.module.css';
import PageTitle from '../PageTitle';
import BreadCrumb from '../BreadCrumb';
import type { PageHeadingPage } from '../pageHeadingModel';

type Props = {
  page: PageHeadingPage;
  isLoading?: boolean;
};

export default function PageHeading({ page, isLoading = false }: Props) {
  return (
    <>
      <div
        className={`${styles.container} text-3xl font-bold pt-5 max-w-340 sm:px-6 lg:px-8 mx-auto pb-2`}
        aria-busy={isLoading}
      >
        {page.type !== 'home' && <BreadCrumb page={page} isLoading={isLoading} />}
        <PageTitle page={page} isLoading={isLoading} />
      </div>
    </>
  );
}
