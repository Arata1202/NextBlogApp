import { HomeIcon, UserCircleIcon, EnvelopeIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { IoAirplaneOutline } from 'react-icons/io5';
import { BookOpenIcon, CommandLineIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { XIcon, InstagramIcon, GitHubIcon } from '@/components/Common/Elements/SocialIcon';

// ブログ情報
export const BlogTitle = [
  {
    // ブログタイトル
    imageUrl: '/images/blog/title.webp',
    imageAlt: 'ブログタイトル',
  },
];

// PC ヘッダーナビゲーション
export const headerNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/profile', icon: UserCircleIcon },
  { name: 'お問い合わせ', href: '/contact', icon: EnvelopeIcon },
];

// ハンバーガーメニュー
export const mobileTopNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/profile', icon: UserCircleIcon },
];
export const categories = [
  { name: '大学生活', href: '/category/university', icon: FolderOpenIcon },
  { name: 'プログラミング', href: '/category/programming', icon: FolderOpenIcon },
  { name: '旅行', href: '/category/travel', icon: FolderOpenIcon },
  { name: 'ブログ', href: '/category/blog', icon: FolderOpenIcon },
];
export const mobileBottomNavigation = [
  { name: 'お問い合わせ', href: '/contact', icon: EnvelopeIcon },
];

export const footerNavigation = {
  solutions: [{ name: 'プロフィール', href: '/profile' }],
  category: [
    { name: '大学生活', href: '/category/university' },
    { name: 'プログラミング', href: '/category/programming' },
    { name: '旅行', href: '/category/travel' },
    { name: 'ブログ', href: '/category/blog' },
  ],
  company: [
    { name: 'プライバシーポリシー', href: '/privacy' },
    { name: '免責事項', href: '/disclaimer' },
    { name: '著作権', href: '/copyright' },
    { name: 'リンク', href: '/link' },
    // { name: '免責事項', href: '#' },
  ],
  legal: [{ name: 'お問い合わせ', href: '/contact' }],
  social: [
    {
      name: 'X',
      href: 'https://twitter.com/Aokumoblog',
      icon: XIcon,
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/ao_realstudent/?hl=ja',
      icon: InstagramIcon,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/Arata1202',
      icon: GitHubIcon,
    },
  ],
};

// プロフィール
export const UserProfile = [
  {
    // 紹介文
    profileIntroduction: [
      { sentence: '21歳' },
      { sentence: '千葉県在住' },
      { sentence: '文系大学生｜26卒' },
      { sentence: '経営学部 マーケティング学科' },
      { sentence: 'Webエンジニアインターンに参加中' },
      { sentence: 'インターン：Vue.js, Laravel' },
      { sentence: '個人開発：Next.js' },
    ],
  },
];

// Twitter Instagram
export const SocialIcon = [
  {
    name: 'X',
    href: 'https://twitter.com/Aokumoblog',
    icon: XIcon,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ao_realstudent/?hl=ja',
    icon: InstagramIcon,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Arata1202',
    icon: GitHubIcon,
  },
];

// カテゴリー サイドバー
export const CategoryList = [
  {
    name: '大学生活',
    href: '/category/university',
    icon: AcademicCapIcon,
  },
  {
    name: 'プログラミング',
    href: '/category/programming',
    icon: CommandLineIcon,
  },
];
export const CategoryList2 = [
  {
    name: '旅行',
    href: '/category/travel',
    icon: IoAirplaneOutline,
  },
  {
    name: 'ブログ',
    href: '/category/blog',
    icon: BookOpenIcon,
  },
];

// おすすめの投稿
export const PopularPost = [
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

// コピーライト
export const copyRight = [
  {
    title: 'Copyright © 2024 リアル大学生 All Rights Reserved.',
  },
];
