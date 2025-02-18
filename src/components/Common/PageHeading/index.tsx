import { Category } from '@/libs/microcms';
import styles from './index.module.css';
import PageTitle from '../PageTitle';
import BreadCrumb from '../BreadCrumb';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
  contact?: boolean;
  copyright?: boolean;
  disclaimer?: boolean;
};

export default function PageHeading({
  year,
  month,
  category,
  contact = false,
  copyright = false,
  disclaimer = false,
}: Props) {
  return (
    <>
      <div
        className={`${styles.container} text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2`}
      >
        <BreadCrumb
          year={year}
          month={month}
          category={category}
          contact={contact}
          copyright={copyright}
          disclaimer={disclaimer}
        />
        <PageTitle
          year={year}
          month={month}
          category={category}
          contact={contact}
          copyright={copyright}
          disclaimer={disclaimer}
        />
      </div>
    </>
  );
}
