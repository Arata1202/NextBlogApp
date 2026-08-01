'use client';

import { useTheme } from 'next-themes';
import styles from './index.module.css';
import {
  colorClassNames,
  getThemeVariantClassName,
  radiusClassNames,
  themeVariantClassNames,
  transitionClassNames,
} from '@/styles/designTokens';

type Props = {
  sponsorName?: string;
  compact?: boolean;
};

export default function SponsoredDisclosure({ sponsorName, compact = false }: Props) {
  const { theme } = useTheme();
  const badgeClassName = `${styles.badge} ${radiusClassNames.control} ${colorClassNames.accentBadge}`;

  if (compact) {
    return <span className={badgeClassName}>PR</span>;
  }

  const disclosureClassName = [
    styles.disclosure,
    radiusClassNames.control,
    transitionClassNames.color,
    getThemeVariantClassName(theme, themeVariantClassNames.borderedText),
    getThemeVariantClassName(theme, themeVariantClassNames.subtleSurface),
  ].join(' ');

  return (
    <aside className={disclosureClassName} aria-label="広告に関する表示">
      <span className={badgeClassName}>PR</span>
      <span>この記事は{sponsorName}から依頼を受け、広告として制作しています。</span>
    </aside>
  );
}
