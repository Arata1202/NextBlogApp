import React from 'react';
import { HomeIcon, UserCircleIcon, EnvelopeIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import { IoAirplaneOutline } from 'react-icons/io5';
import { BookOpenIcon, CommandLineIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

type IconProps = React.SVGProps<SVGSVGElement>;

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
  // { name: 'サイトマップ', href: '/sitemap', icon: DocumentMagnifyingGlassIcon },
  // { name: 'プライバシーポリシー', href: '/privacy', icon: InformationCircleIcon },
  { name: 'お問い合わせ', href: '/contact', icon: EnvelopeIcon },
];

export const footerNavigation = {
  solutions: [
    { name: 'プロフィール', href: '/profile' },
    { name: 'サイトマップ', href: '/sitemap' },
  ],
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
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/ao_realstudent/?hl=ja',
      icon: (props: IconProps) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/Arata1202',
      icon: (props: React.SVGProps<SVGSVGElement>) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.111 0.82-0.261 0.82-0.577 0-0.285-0.011-1.04-0.017-2.042-3.338 0.724-4.042-1.611-4.042-1.611-0.546-1.387-1.333-1.757-1.333-1.757-1.089-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.839 1.236 1.839 1.236 1.07 1.835 2.807 1.304 3.492 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.303-5.467-1.333-5.467-5.931 0-1.31 0.469-2.381 1.236-3.221-0.123-0.303-0.536-1.523 0.117-3.176 0 0 1.008-0.323 3.301 1.23 0.957-0.266 1.983-0.398 3.005-0.403 1.02 0.005 2.047 0.137 3.006 0.403 2.292-1.553 3.299-1.23 3.299-1.23 0.655 1.653 0.242 2.873 0.119 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.625-5.476 5.922 0.43 0.371 0.814 1.103 0.814 2.222 0 1.606-0.014 2.896-0.014 3.287 0 0.32 0.217 0.694 0.825 0.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ],
};

// プロフィール
export const UserProfile = [
  {
    // 肩書き
    profileTitle: 'ブログ運営者',
    // ユーザー名
    profileName: 'あらた',
    profileHref: '/profile',
    // ユーザー写真
    imageUrl: '/images/blog/face.webp',
    imageAlt: '筆者のイメージ',
    // 紹介文
    profileIntroduction: [
      { sentence: '21歳' },
      { sentence: '千葉県在住' },
      { sentence: '文系大学生｜26卒' },
      { sentence: '経営学部 マーケティング学科' },
      { sentence: 'Webエンジニアインターンに参加中' },
      { sentence: 'インターン：Vue.js, Laravel' },
      { sentence: '個人開発：React, Next.js, PHP' },
    ],
  },
];

// Twitter Instagram
export const SocialIcon = [
  {
    name: 'X',
    href: 'https://twitter.com/Aokumoblog',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/ao_realstudent/?hl=ja',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/Arata1202',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.111 0.82-0.261 0.82-0.577 0-0.285-0.011-1.04-0.017-2.042-3.338 0.724-4.042-1.611-4.042-1.611-0.546-1.387-1.333-1.757-1.333-1.757-1.089-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.839 1.236 1.839 1.236 1.07 1.835 2.807 1.304 3.492 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.303-5.467-1.333-5.467-5.931 0-1.31 0.469-2.381 1.236-3.221-0.123-0.303-0.536-1.523 0.117-3.176 0 0 1.008-0.323 3.301 1.23 0.957-0.266 1.983-0.398 3.005-0.403 1.02 0.005 2.047 0.137 3.006 0.403 2.292-1.553 3.299-1.23 3.299-1.23 0.655 1.653 0.242 2.873 0.119 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.625-5.476 5.922 0.43 0.371 0.814 1.103 0.814 2.222 0 1.606-0.014 2.896-0.014 3.287 0 0.32 0.217 0.694 0.825 0.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
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
