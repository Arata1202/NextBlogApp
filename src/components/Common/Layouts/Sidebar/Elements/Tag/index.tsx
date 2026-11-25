'use client';

import { SiteLink as Link } from '@/components/Common/AppWebViewLinkHandler';
import { useResolvedTheme } from '@/components/Common/useResolvedTheme';
import { HashtagIcon } from '@heroicons/react/24/solid';
import { Tag as TagType } from '@/types/microcms';
import { pillControlClassName } from '@/components/Common/controlClassNames';
import { getThemeClassName, surfaceClassNames } from '@/styles/uiClassNames';

type Props = {
  tags: TagType[];
};

export default function Tag({ tags }: Props) {
  const theme = useResolvedTheme();
  const themeClassName = getThemeClassName(theme);

  return (
    <>
      <div className={`pt-8 px-4 mt-5 ${surfaceClassNames.panel} ${themeClassName}`}>
        <div className={`text-2xl text-center font-semibold flex justify-center`}>
          <HashtagIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          タグ
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.id}`}
              className={`${pillControlClassName} inline-block px-3 py-1 text-sm font-semibold ${themeClassName}`}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
