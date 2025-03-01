import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  LightBulbIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import { ContentBlock } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  block: ContentBlock;
  merit?: boolean;
  demerit?: boolean;
  common?: boolean;
  point?: boolean;
};

export default function TabBox({
  block,
  merit = false,
  demerit = false,
  point = false,
  common = false,
}: Props) {
  return (
    <>
      <div
        className={`${merit && styles.tab_merit_box} ${demerit && styles.tab_demerit_box} ${point && styles.tab_point_box} ${common && styles.tab_common_box} text-gray-700 flex items-center`}
      >
        {merit && (
          <>
            <HandThumbUpIcon className={`h-8 w-8 ${styles.tab_merit_box_icon}`} />
            <div dangerouslySetInnerHTML={{ __html: block.box_merit! }} />
          </>
        )}
        {demerit && (
          <>
            <HandThumbDownIcon className={`h-8 w-8 ${styles.tab_demerit_box_icon}`} />
            <div dangerouslySetInnerHTML={{ __html: block.box_demerit! }} />
          </>
        )}
        {point && (
          <>
            <LightBulbIcon className={`h-8 w-8 ${styles.tab_point_box_icon}`} />
            <div dangerouslySetInnerHTML={{ __html: block.box_point! }} />
          </>
        )}
        {common && (
          <>
            <InformationCircleIcon className={`h-8 w-8 ${styles.tab_common_box_icon}`} />
            <div dangerouslySetInnerHTML={{ __html: block.box_common! }} />
          </>
        )}
      </div>
    </>
  );
}
