import { HomeIcon, UserCircleIcon, EnvelopeIcon, FolderOpenIcon } from '@heroicons/react/24/solid';

type SocialIconType = {
  name: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

// ブログ情報
export const BlogTitle = [
  {
    // ブログタイトル
    imageUrl: '/images/sample/3.webp',
    imageAlt: 'ブログタイトル',
  },
];

// PC　ヘッダーナビゲーション
export const headerNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
  { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
];

// ハンバーガーメニュー
export const mobileTopNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
];
export const categories = [
  { name: '大学生活', href: '/tags/university', icon: FolderOpenIcon },
  { name: 'プログラミング', href: '/tags/programming', icon: FolderOpenIcon },
];
export const mobileBottomNavigation = [
  { name: 'サイトマップ', href: '/fixed/sitemap', icon: UserCircleIcon },
  { name: 'プライバシーポリシー', href: '/fixed/privacy', icon: UserCircleIcon },
  { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
];

// プロフィール
export const UserProfile = [
  {
    // 肩書き
    profileTitle: 'ブログ運営者',
    // ユーザー名
    profileName: 'ダミーさん',
    profileHref: '/fixed/profile',
    // ユーザー写真
    imageUrl: '/images/sample/2.webp',
    imageAlt: '筆者のイメージ',
    //　紹介文
    profileIntroduction: [
      { sentence: 'ダミーです' },
      { sentence: 'ダミーです' },
      { sentence: 'ダミーです' },
      { sentence: 'ダミーです' },
      { sentence: 'ダミーです' },
    ],
  },
];

// Twitter Instagram
export const SocialIcon = [
  {
    name: 'Twitter',
    href: '/',
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: '/',
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
];

// カテゴリー サイドバー
export const CategoryList = [
  {
    name: '▶︎ 大学生活',
    href: '/',
  },
  {
    name: '▶︎ プログラミング',
    href: '/',
  },
];

// 人気の投稿
export const PopularPost = [
  {
    postName: 'サンプルサンプルサンプルサンプルサンプルサンプルサンプルサンプル1',
    postHref: '/',
    imageHref: '/images/sample/4.webp',
    imageAlt: 'サムネイル',
  },
  {
    postName: 'サンプルサンプルサンプルサンプルサンプルサンプルサンプルサンプル2',
    postHref: '/',
    imageHref: '/images/sample/5.webp',
    imageAlt: 'サムネイル',
  },
  {
    postName: 'サンプルサンプルサンプルサンプルサンプルサンプルサンプルサンプル3',
    postHref: '/',
    imageHref: '/images/sample/6.webp',
    imageAlt: 'サムネイル',
  },
];

// コピーライト
export const copyRight = [
  {
    title: '&copy; Copyright © 2024 サンプル All Rights Reserved.',
  },
];

// import { HomeIcon, UserCircleIcon, EnvelopeIcon, FolderOpenIcon } from '@heroicons/react/24/solid';

// type SocialIconType = {
//   name: string;
//   href: string;
//   icon: React.FC<React.SVGProps<SVGSVGElement>>;
// };

// // ブログ情報
// export const BlogTitle = [
//   {
//     // ブログタイトル
//     imageUrl: '/images/sample/3.webp',
//     imageAlt: 'ブログタイトル',
//   },
// ];

// // PC　ヘッダーナビゲーション
// export const headerNavigation = [
//   { name: 'ホーム', href: '/', icon: HomeIcon },
//   { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
//   { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
// ];

// // ハンバーガーメニュー
// export const mobileTopNavigation = [
//   { name: 'ホーム', href: '/', icon: HomeIcon },
//   { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
// ];
// export const categories = [
//   { name: '大学生活', href: '/tags/university', icon: FolderOpenIcon },
//   { name: 'プログラミング', href: '/tags/programming', icon: FolderOpenIcon },
// ];
// export const mobileBottomNavigation = [
//   { name: 'サイトマップ', href: '/fixed/sitemap', icon: UserCircleIcon },
//   { name: 'プライバシーポリシー', href: '/fixed/privacy', icon: UserCircleIcon },
//   { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
// ];

// // プロフィール
// export const UserProfile = [
//   {
//     // 肩書き
//     profileTitle: 'ブログ運営者',
//     // ユーザー名
//     profileName: 'リアル大学生｜あお',
//     profileHref: '/fixed/profile',
//     // ユーザー写真
//     imageUrl: '/images/blog/face.webp',
//     imageAlt: '筆者のイメージ',
//     //　紹介文
//     profileIntroduction: [
//       { sentence: '20歳' },
//       { sentence: '千葉県在住' },
//       { sentence: '文系大学生｜26卒' },
//       { sentence: 'マーケティング学科' },
//       { sentence: 'Webエンジニアインターンに参加（主にLaravelやVue.js）' },
//       { sentence: 'プログラミングは大学生から開始。独学でPHPやJavaScriptなどを習得' },
//     ],
//   },
// ];

// // Twitter Instagram
// export const SocialIcon = [
//   {
//     name: 'X',
//     href: 'https://twitter.com/Aokumoblog',
//     icon: (props: React.SVGProps<SVGSVGElement>) => (
//       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//         <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
//       </svg>
//     ),
//   },
//   {
//     name: 'Instagram',
//     href: 'https://www.instagram.com/ao_realstudent/?hl=ja',
//     icon: (props: React.SVGProps<SVGSVGElement>) => (
//       <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
//         <path
//           fillRule="evenodd"
//           d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
//           clipRule="evenodd"
//         />
//       </svg>
//     ),
//   },
// ];

// // カテゴリー サイドバー
// export const CategoryList = [
//   {
//     name: '▶︎ 大学生活',
//     href: '/tags/university',
//   },
//   {
//     name: '▶︎ プログラミング',
//     href: '/tags/programming',
//   },
// ];

// // 人気の投稿
// export const PopularPost = [
//   {
//     postName: '【乳頭温泉郷】鶴の湯に宿泊！予約方法やアクセスについて解説',
//     postHref: '/',
//     imageHref: '/images/post/1.webp',
//     imageAlt: 'サムネイル',
//   },
//   {
//     postName: '【文系】大学生必見！大学でのリアルな持ち物を大公開【かばんの中身】',
//     postHref: '/',
//     imageHref: '/images/post/2.webp',
//     imageAlt: 'サムネイル',
//   },
//   {
//     postName: '【勉強法】１か月で習得！PHP学習のおすすめロードマップを紹介【プログラミング】',
//     postHref: '/',
//     imageHref: '/images/post/3.webp',
//     imageAlt: 'サムネイル',
//   },
// ];

// // コピーライト
// export const copyRight = [
//   {
//     title: '&copy; Copyright © 2024 リアル大学生 All Rights Reserved.',
//   },
// ];
