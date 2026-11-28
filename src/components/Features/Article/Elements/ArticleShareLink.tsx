'use client';

import { ARTICLE_SHARE_ID } from '@/constants/navigation';
import { focusAndScroll } from '@/utils/focusAndScroll';
import { useTheme } from 'next-themes';
import { getTextLinkClassName } from '@/components/Common/controlClassNames';

export default function ArticleShareLink() {
  const { theme } = useTheme();

  return (
    <a
      href={`#${ARTICLE_SHARE_ID}`}
      className={getTextLinkClassName(theme)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        const { hash } = event.currentTarget;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;

        event.preventDefault();
        if (window.location.hash !== hash) window.history.pushState(null, '', hash);
        focusAndScroll(target);
      }}
    >
      この記事をシェアする
    </a>
  );
}
