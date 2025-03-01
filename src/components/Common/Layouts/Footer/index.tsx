'use client';

import { useTheme } from 'next-themes';
import styles from './index.module.css';
import { BlogTitle, copyRight, footerNavigation } from '@/constants/Data';

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
              <a href="/" className={styles.logo}>
                {BlogTitle.map((item) => (
                  <img
                    key={item.imageUrl}
                    src={
                      theme === 'dark' ? '/images/blog/title-dark.jpeg' : '/images/blog/title.webp'
                    }
                    alt={item.imageAlt}
                    className="hover:scale-110 transition-transform"
                    width={165}
                    height={30}
                  />
                ))}
              </a>
              <div className={`${styles.logo} flex space-x-6`}>
                {footerNavigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="blank"
                    className={`hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </a>
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
                    {footerNavigation.solutions.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </a>
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
                    {footerNavigation.category.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </a>
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
                    {footerNavigation.company.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </a>
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
                    {footerNavigation.legal.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                        >
                          {item.name}
                        </a>
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
            {copyRight.map((item) => (
              <div
                key={item.title}
                className={`text-xs leading-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                {item.title}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
