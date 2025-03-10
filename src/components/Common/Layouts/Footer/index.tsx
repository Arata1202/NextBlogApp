'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import styles from './index.module.css';
import { BLOG_IMAGE, COPYRIGHT, FOOTER_NAVIGATION, SOCIAL_ICON } from '@/constants/data';
import { CATEGORY_ARR } from '@/constants/category';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <>
      <footer
        className={`${styles.footer} mt-5 w-full ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <Link href="/" className={styles.logo}>
                {BLOG_IMAGE.map((item) => (
                  <img
                    key={item.alt}
                    src={theme === 'dark' ? item.path.dark : item.path.light}
                    alt={item.alt}
                    className="hover:scale-110 transition-transform"
                    width={165}
                    height={30}
                  />
                ))}
              </Link>
              <div className={`${styles.logo} flex space-x-6`}>
                {SOCIAL_ICON.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    target="blank"
                    className={`hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
              <div className={`${styles.menu} md:grid md:grid-cols-2 md:gap-8`}>
                <div>
                  <div
                    className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    ブログについて
                  </div>
                  <ul className="mt-6 space-y-4">
                    {FOOTER_NAVIGATION.about.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <div
                    className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    カテゴリー
                  </div>
                  <ul className="mt-6 space-y-4">
                    {CATEGORY_ARR.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={`/category/${item.id}`}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`${styles.menu} md:grid md:grid-cols-2 md:gap-8`}>
                <div>
                  <div
                    className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    利用規約
                  </div>
                  <ul className="mt-6 space-y-4">
                    {FOOTER_NAVIGATION.policy.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <div
                    className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    お問い合わせ
                  </div>
                  <ul className="mt-6 space-y-4">
                    {FOOTER_NAVIGATION.contact.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`mt-16 border-t pt-8 sm:mt-20 lg:mt-24 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <div className={`text-xs leading-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
              {COPYRIGHT}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
