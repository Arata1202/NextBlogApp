import { HomeIcon, UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { XIcon, GitHubIcon, YouTubeIcon } from '@/components/Common/Elements/SocialIcon';

export const DESCRIPTION =
  '大学生活やプログラミングに関する情報を、現役大学生の視点から解説しています。';

export const BLOG_IMAGE = [
  {
    path: { light: '/images/blog/title.webp', dark: '/images/blog/title-dark.jpeg' },
    alt: 'タイトル',
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
    name: 'YouTube',
    path: 'https://www.youtube.com/@realalexvlog',
    icon: YouTubeIcon,
  },
  {
    name: 'GitHub',
    path: 'https://github.com/Arata1202',
    icon: GitHubIcon,
  },
];

export const COPYRIGHT = 'Copyright © 2024 リアル大学生 All Rights Reserved.';

export const PROFILE_NAME = 'Arata1202';

export const PROFILE_IMAGE = [
  {
    path: '/images/blog/face.png',
    alt: '筆者',
  },
];

export const PROFILE_SENTENCE = [
  { sentence: '22歳' },
  { sentence: '文系大学4年｜26卒' },
  { sentence: 'Web系エンジニアに内定' },
];
