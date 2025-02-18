import styles from './index.module.css';
import PageTitle from './Elements/PageTitle';
import BreadCrumb from './Elements/BreadCrumb';

type Props = {
  year?: string;
  month?: string;
};

export default function PageHeading({ year, month }: Props) {
  return (
    <>
      <div
        className={`${styles.container} text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2`}
      >
        <BreadCrumb year={year} month={month} />
        <PageTitle year={year} month={month} />
      </div>
    </>
  );
}
