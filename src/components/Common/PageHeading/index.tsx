import { Category, Tag } from '@/libs/microcms';
import styles from './index.module.css';
import PageTitle from '../PageTitle';
import BreadCrumb from '../BreadCrumb';

type Props = {
  year?: string;
  month?: string;
  category?: Category;
  tag?: Tag;
  home?: boolean;
  contact?: boolean;
  copyright?: boolean;
  disclaimer?: boolean;
  link?: boolean;
  privacy?: boolean;
  profile?: boolean;
  sitemap?: boolean;
};

export default function PageHeading({
  year,
  month,
  category,
  tag,
  home = false,
  contact = false,
  copyright = false,
  disclaimer = false,
  link = false,
  privacy = false,
  profile = false,
  sitemap = false,
}: Props) {
  return (
    <>
      <div
        className={`${styles.container} text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2`}
      >
        {!home && (
          <BreadCrumb
            year={year}
            month={month}
            category={category}
            tag={tag}
            contact={contact}
            copyright={copyright}
            disclaimer={disclaimer}
            link={link}
            privacy={privacy}
            profile={profile}
            sitemap={sitemap}
          />
        )}
        <PageTitle
          year={year}
          month={month}
          category={category}
          tag={tag}
          home={home}
          contact={contact}
          copyright={copyright}
          disclaimer={disclaimer}
          link={link}
          privacy={privacy}
          profile={profile}
          sitemap={sitemap}
        />
      </div>
    </>
  );
}
