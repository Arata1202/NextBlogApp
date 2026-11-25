import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return staticPageMetadata('/link', 'リンク', 'リンクについて記載しています。');
}

export default function LinkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
