import { HomeIcon, UserCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { XIcon, InstagramIcon, GitHubIcon } from '@/components/Common/Elements/SocialIcon';

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
    name: 'Instagram',
    path: 'https://www.instagram.com/realunivlog/?hl=ja',
    icon: InstagramIcon,
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
  { sentence: '21歳' },
  { sentence: '千葉県在住' },
  { sentence: '文系大学生｜26卒' },
  { sentence: '経営学部 マーケティング学科' },
  { sentence: 'Webエンジニアインターンに参加中' },
  { sentence: 'インターン：Vue.js, Laravel' },
  { sentence: '個人開発：Next.js' },
];

export const POPULAR_POST = [
  {
    postName:
      '【リクビジョン】就活生のための就活管理サービス、「リクビジョン」をリリースしました！',
    postHref: '/articles/qyjjrfa737bk',
    imageHref: '/images/post/21.png',
    imageAlt: 'サムネイル',
  },
  {
    postName: '【乳頭温泉郷】鶴の湯に宿泊！予約方法やアクセスについて解説',
    postHref: '/articles/nyuto-hotspring-tsurunoyu-reservation-access',
    imageHref: '/images/post/1.webp',
    imageAlt: 'サムネイル',
  },
  {
    postName: '【文系】大学生必見！大学でのリアルな持ち物を大公開【かばんの中身】',
    postHref: '/articles/university-student-real-personal-effects',
    imageHref: '/images/post/2.webp',
    imageAlt: 'サムネイル',
  },
];
