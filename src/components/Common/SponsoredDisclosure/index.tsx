'use client';

import { useTheme } from 'next-themes';
import styles from './index.module.css';
import {
  getThemeVariantClassName,
  radiusClassNames,
  themeVariantClassNames,
  transitionClassNames,
} from '@/styles/uiClassNames';

type Props = {
  compact?: boolean;
};

export default function SponsoredDisclosure({ compact = false }: Props) {
  const { theme } = useTheme();
  const badgeClassName = `${styles.badge} ${radiusClassNames.control} bg-blue-600 text-white`;

  if (compact) {
    return <span className={badgeClassName}>PR</span>;
  }

  const disclosureClassName = [
    styles.disclosure,
    radiusClassNames.control,
    transitionClassNames.color,
    getThemeVariantClassName(theme, themeVariantClassNames.borderedText),
    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50',
  ].join(' ');

  return (
    <aside className={disclosureClassName} aria-label="広告に関する表示">
      <span className={badgeClassName}>PR</span>
      <span>本記事は、広告主から依頼を受けて制作した広告です。</span>
    </aside>
  );
}
