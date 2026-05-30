import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PageTitle from '@/components/Common/PageTitle';
import { createCategory, createTag } from '@/test/factories';

describe('PageTitle', () => {
  it.each([
    [<PageTitle home />, '最新記事'],
    [<PageTitle contact />, 'お問い合わせ'],
    [<PageTitle copyright />, '著作権'],
    [<PageTitle disclaimer />, '免責事項'],
    [<PageTitle link />, 'リンク'],
    [<PageTitle privacy />, 'プライバシーポリシー'],
    [<PageTitle profile />, 'プロフィール'],
    [<PageTitle sitemap />, 'サイトマップ'],
    [<PageTitle search />, '検索結果'],
    [<PageTitle search searchKeyword="React" />, '「React」の検索結果'],
    [<PageTitle year="2024" month="01" />, '2024年1月'],
    [<PageTitle category={createCategory({ name: 'プログラミング' })} />, 'プログラミング'],
    [<PageTitle tag={createTag({ name: 'React' })} />, 'React'],
  ])('renders %s', (element, heading) => {
    render(element);

    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
