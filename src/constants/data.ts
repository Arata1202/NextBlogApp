import { HomeIcon, UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { XIcon, GitHubIcon, ZennIcon } from '@/components/Common/Elements/SocialIcon';

export const DESCRIPTION =
  '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。';

export const BLOG_IMAGE = [
  {
    path: { light: '/images/blog/title.webp', dark: '/images/blog/title-dark.webp' },
    alt: 'リアル大学生',
  },
];

export const HEADER_NAVIGATION = [
  { name: 'ホーム', path: '/', icon: HomeIcon },
  { name: 'プロフィール', path: '/profile', icon: UserCircleIcon },
  { name: 'お問い合わせ', path: '/contact', icon: EnvelopeIcon },
];

export const FOOTER_NAVIGATION = {
  about: [
    { name: 'プロフィール', path: '/profile' },
    { name: 'サイトマップ', path: '/sitemap-html' },
  ],
  policy: [
    { name: 'プライバシーポリシー', path: '/privacy' },
    { name: '免責事項', path: '/disclaimer' },
    { name: '著作権', path: '/copyright' },
    { name: 'リンク', path: '/link' },
  ],
  contact: [{ name: 'お問い合わせ', path: '/contact' }],
};

export const SOCIAL_ICON = [
  {
    name: 'X',
    path: 'https://twitter.com/realunivlog',
    icon: XIcon,
  },
  {
    name: 'GitHub',
    path: 'https://github.com/Arata1202',
    icon: GitHubIcon,
  },
  {
    name: 'Zenn',
    path: 'https://zenn.dev/realunivlog',
    icon: ZennIcon,
  },
];

export const COPYRIGHT = 'Copyright © 2024 リアル大学生 All Rights Reserved.';

export const PROFILE_NAME = 'Arata1202';

export const PROFILE_IMAGE = [
  {
    path: '/images/blog/face.webp',
    alt: '筆者',
  },
];

export const PROFILE_SENTENCE = [
  { sentence: '23歳' },
  { sentence: '文系｜26卒で、現在は社会人です' },
  { sentence: 'Web系SaaS企業でエンジニアやってます' },
];
