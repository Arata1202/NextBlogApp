'use client';

import { useTheme } from 'next-themes';
import styles from './index.module.css';
import {
  getThemeVariantClassName,
  radiusClassNames,
  themeVariantClassNames,
} from '@/styles/uiClassNames';

type Props = {
  compact?: boolean;
};

const SPONSORED_BADGE_THEME_CLASS_NAMES = {
  light: 'bg-blue-600/10 text-blue-700 inset-ring-blue-600/20',
  dark: 'bg-blue-400/10 text-blue-300 inset-ring-blue-400/20',
} as const;

export default function SponsoredDisclosure({ compact = false }: Props) {
  const { theme } = useTheme();
  const badgeClassName = [
    'inline-flex w-fit shrink-0 items-center px-2 py-1 text-xs font-medium inset-ring',
    radiusClassNames.control,
    getThemeVariantClassName(theme, SPONSORED_BADGE_THEME_CLASS_NAMES),
  ].join(' ');

  if (compact) {
    return <span className={badgeClassName}>PR</span>;
  }

  const disclosureClassName = [
    styles.disclosure,
    'flex justify-start text-left p-3 border',
    getThemeVariantClassName(theme, themeVariantClassNames.borderedText),
  ].join(' ');

  return (
    <aside className={disclosureClassName} aria-label="広告に関する表示">
      <span className={badgeClassName}>PR</span>
      <span>本記事は、広告主から依頼を受けて制作した広告です。</span>
    </aside>
  );
}
