import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageTitle from '@/components/Common/PageTitle';
import { createCategory, createTag } from '@/test/factories';

describe('PageTitle', () => {
  it.each([
    [<PageTitle page={{ type: 'home' }} />, '最新記事'],
    [<PageTitle page={{ type: 'contact' }} />, 'お問い合わせ'],
    [<PageTitle page={{ type: 'copyright' }} />, '著作権'],
    [<PageTitle page={{ type: 'disclaimer' }} />, '免責事項'],
    [<PageTitle page={{ type: 'link' }} />, 'リンク'],
    [<PageTitle page={{ type: 'privacy' }} />, 'プライバシーポリシー'],
    [<PageTitle page={{ type: 'profile' }} />, 'プロフィール'],
    [<PageTitle page={{ type: 'sitemap' }} />, 'サイトマップ'],
    [<PageTitle page={{ type: 'search' }} />, '検索結果'],
    [<PageTitle page={{ type: 'search', searchKeyword: 'React' }} />, '「React」の検索結果'],
    [<PageTitle page={{ type: 'archive', year: '2024', month: '01' }} />, '2024年1月'],
    [
      <PageTitle
        page={{ type: 'category', category: createCategory({ name: 'プログラミング' }) }}
      />,
      'プログラミング',
    ],
    [<PageTitle page={{ type: 'tag', tag: createTag({ name: 'React' }) }} />, 'React'],
  ])('renders %s', (element, heading) => {
    render(element);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
