import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return staticPageMetadata('/disclaimer', '免責事項', '免責事項を記載しています。');
}

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
