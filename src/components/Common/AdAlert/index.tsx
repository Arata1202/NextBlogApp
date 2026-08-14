'use client';

import { useTheme } from 'next-themes';
import { MegaphoneIcon } from '@heroicons/react/24/outline';
import styles from './index.module.css';
import { getThemeVariantClassName, themeVariantClassNames } from '@/styles/uiClassNames';

export default function AdAlert() {
  const { theme } = useTheme();
  const borderedTextClassName = getThemeVariantClassName(
    theme,
    themeVariantClassNames.borderedText,
  );

  return (
    <>
      <div
        className={`${styles.alert} flex justify-center text-center p-3 border ${borderedTextClassName}`}
      >
        <MegaphoneIcon className="h-7 w-7 mr-2" aria-hidden="true" />
        この記事には広告が含まれています。
      </div>
    </>
  );
}
