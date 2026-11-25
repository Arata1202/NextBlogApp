import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  LightBulbIcon,
  InformationCircleIcon,
} from '@heroicons/react/20/solid';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { sanitizeCmsHtml } from '@/utils/htmlSanitizer';

const icons = {
  merit: HandThumbUpIcon,
  demerit: HandThumbDownIcon,
  point: LightBulbIcon,
  common: InformationCircleIcon,
};

type Props = {
  variant: keyof typeof icons;
  block: ContentBlock;
  sponsorUrl?: string;
};

export default function TabBox({ variant, block, sponsorUrl }: Props) {
  const Icon = icons[variant];
  const html = block[`box_${variant}`];
  return (
    <div className={`${styles[`tab_${variant}_box`]} flex items-center gap-4 text-gray-700`}>
      <Icon className={`h-8 w-8 ${styles[`tab_${variant}_box_icon`]}`} aria-hidden="true" />
      {html && <div dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(html, sponsorUrl) }} />}
    </div>
  );
}
