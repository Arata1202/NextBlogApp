'use client';

import { useTheme } from 'next-themes';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';

export default function ArticleShareLink() {
  const { theme } = useTheme();

  return (
    <a
      href="#article-share"
      className={getTextLinkClassName(theme)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const { hash } = event.currentTarget;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        event.preventDefault();
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
        target.focus({ preventScroll: true });
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' });
      }}
    >
      この記事をシェアする
    </a>
  );
}
