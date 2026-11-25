import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageTitle from '@/components/Common/PageTitle';
import { createCategory, createTag } from '@/test/factories';

describe('PageTitle', () => {
  it.each<[ComponentProps<typeof PageTitle>['page'], string]>([
    [{ type: 'home' }, '最新記事'],
    [{ type: 'contact' }, 'お問い合わせ'],
    [{ type: 'copyright' }, '著作権'],
    [{ type: 'disclaimer' }, '免責事項'],
    [{ type: 'link' }, 'リンク'],
    [{ type: 'privacy' }, 'プライバシーポリシー'],
    [{ type: 'profile' }, 'プロフィール'],
    [{ type: 'sitemap' }, 'サイトマップ'],
    [{ type: 'search' }, '検索結果'],
    [{ type: 'search', searchKeyword: 'React' }, '「React」の検索結果'],
    [{ type: 'archive', year: '2024', month: '01' }, '2024年1月'],
    [
      { type: 'category', category: createCategory({ name: 'プログラミング' }) },
      'プログラミング',
    ],
    [{ type: 'tag', tag: createTag({ name: 'React' }) }, 'React'],
  ])('renders %s', (page, heading) => {
    render(<PageTitle page={page} />);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
