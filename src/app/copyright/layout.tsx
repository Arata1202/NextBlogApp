import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return staticPageMetadata('/copyright', '著作権', '著作権について記載しています。');
}

export default function CopyrightLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
