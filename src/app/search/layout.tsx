import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return {
    ...staticPageMetadata('/search', '検索結果', '検索結果を表示するページです。'),
    robots: { index: false },
  };
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
