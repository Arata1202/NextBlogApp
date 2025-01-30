'use client';

import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';
import { BlogTitle, copyRight, footerNavigation } from '@/section/dummy';
import { useTheme } from 'next-themes';

export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer
      className={`mt-10 ${styles.footer} w-full ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <a href="/" className="underLogo">
              {BlogTitle.map((item) => (
                <Image
                  key={item.imageUrl}
                  className="hover:scale-110 transition-transform"
                  width={165}
                  height={30}
                  src={
                    theme === 'dark' ? '/images/blog/title-dark.jpeg' : '/images/blog/title.webp'
                  }
                  alt={item.imageAlt}
                />
              ))}
            </a>
            <div className="flex space-x-6 underLogo">
              {footerNavigation.social.map((item) => (
                <a
                  key={item.name}
                  target="blank"
                  href={item.href}
                  className={`hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="footerMenu">
                <h1
                  className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  ブログについて
                </h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0 footerMenu">
                <h1
                  className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  カテゴリー
                </h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.category.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8 footerMenu">
              <div>
                <h1
                  className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  利用規約
                </h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className={`text-sm leading-6  hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0 footerMenu">
                <h1
                  className={`text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  お問い合わせ
                </h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
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
            <h1
              key={item.title}
              className={`text-xs leading-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            >
              {item.title}
            </h1>
          ))}
        </div>
      </div>
    </footer>
  );
}
