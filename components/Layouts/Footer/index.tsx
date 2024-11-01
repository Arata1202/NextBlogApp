'use client';

import React from 'react';
import styles from './index.module.css';
import Image from 'next/image';
import { BlogTitle, copyRight, footerNavigation } from '@/section/dummy';
import MobileBanner from '../../Layouts/MobileBanner';

export default function Footer() {
  return (
    <footer className={`${styles.footer} w-full bg-white`}>
      <MobileBanner />
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
                  width={165}
                  height={30}
                  src={item.imageUrl}
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
                  className="text-gray-400 hover:text-blue-500"
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
                <h1 className="text-sm font-semibold leading-6 text-gray-900">ブログについて</h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className="text-sm leading-6 text-gray-600 hover:text-blue-500"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0 footerMenu">
                <h1 className="text-sm font-semibold leading-6 text-gray-900">カテゴリー</h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.category.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className="text-sm leading-6 text-gray-600 hover:text-blue-500"
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
                <h1 className="text-sm font-semibold leading-6 text-gray-900">利用規約</h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className="text-sm leading-6 text-gray-600 hover:text-blue-500"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0 footerMenu">
                <h1 className="text-sm font-semibold leading-6 text-gray-900">お問い合わせ</h1>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          event.preventDefault();
                          window.location.href = item.href;
                        }}
                        className="text-sm leading-6 text-gray-600 hover:text-blue-500"
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
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          {copyRight.map((item) => (
            <h1 key={item.title} className={`text-xs leading-5 text-gray-500`}>
              {item.title}
            </h1>
          ))}
        </div>
      </div>
    </footer>
  );
}
