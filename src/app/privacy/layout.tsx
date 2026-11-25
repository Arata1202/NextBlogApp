import { staticPageMetadata } from '@/config/site';

export function generateMetadata() {
  return staticPageMetadata(
    '/privacy',
    'プライバシーポリシー',
    'プライバシーポリシーを記載しています。',
  );
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
