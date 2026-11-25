import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return staticPageMetadata(
    '/sitemap-html',
    'サイトマップ',
    '当ブログのサイトマップを記載しています。',
  );
}

export default function SitemapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
