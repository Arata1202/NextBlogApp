'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { HomeIcon, UserCircleIcon, EnvelopeIcon, FolderIcon } from '@heroicons/react/24/solid';

const headerNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
  { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
];

const mobileTopNavigation = [
  { name: 'ホーム', href: '/', icon: HomeIcon },
  { name: 'プロフィール', href: '/fixed/profile', icon: UserCircleIcon },
];

const mobileBottomNavigation = [
  { name: 'サイトマップ', href: '/fixed/sitemap', icon: UserCircleIcon },
  { name: 'プライバシーポリシー', href: '/fixed/privacy', icon: UserCircleIcon },
  { name: 'お問い合わせ', href: '/fixed/contact', icon: EnvelopeIcon },
];

const categories = [
  { name: '大学生活', href: '/tags/university' },
  { name: 'プログラミング', href: '/tags/programming' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log('モバイルメニューの状態：', mobileMenuOpen);

  return (
    <header className={`${styles.header} fixed top-0 left-0 w-full bg-white z-30`}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <Image width={165} height={30} src="/images/blog/title.webp" alt="ブログタイトル" />
        </a>
        <div className="flex lg:hidden">
          {mobileMenuOpen ? (
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close main menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="hidden lg:flex lg:gap-x-12">
          {headerNavigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="flex text-sm leading-6 text-gray-900 hover:text-blue-500"
            >
              <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
              {item.name}
            </a>
          ))}
          <Popover className="relative">
            {({ open, close }) => (
              <>
                <Popover.Button className="flex items-center text-sm font-medium text-gray-900 hover:text-blue-500 focus:outline-none">
                  <FolderIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  カテゴリー
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => close()}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="hamburger fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <h1 className="text-2xl bg-gray-300 font-bold text-center mt-4 p-2">Menu</h1>
                {mobileTopNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="mt-10 flex text-xl leading-6 text-gray-900 hover:text-blue-500 border-b border-gray-300"
                  >
                    {/* <item.icon className="h-5 w-5 mr-2 my-4" aria-hidden="true" /> */}
                    <b className="text-xl my-3">▶︎ {item.name}</b>
                  </a>
                ))}
                <div className="mt-10 flex text-xl leading-6 text-gray-900 border-b border-gray-300">
                  <b className="text-xl my-3">▶︎ カテゴリー</b>
                </div>
                {categories.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="ml-5 mt-10 flex text-xl leading-6 text-gray-900 hover:text-blue-500 border-b border-gray-300"
                  >
                    {/* <item.icon className="h-5 w-5 mr-2 my-4" aria-hidden="true" /> */}
                    <b className="text-xl my-3">＞ {item.name}</b>
                  </a>
                ))}
                {mobileBottomNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="mt-10 flex text-xl leading-6 text-gray-900 hover:text-blue-500 border-b border-gray-300"
                  >
                    {/* <item.icon className="h-5 w-5 mr-2 my-4" aria-hidden="true" /> */}
                    <b className="text-xl my-3">▶︎ {item.name}</b>
                  </a>
                ))}
                {/* <Popover className="relative">
                  <Popover.Button className="flex items-center text-sm font-medium text-gray-900 hover:text-blue-500 focus:outline-none">
                    <FolderIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    <b className="text-2xl my-3">▶︎ カテゴリー</b>
                    <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            href={category.href}
                            className="block px-4 py-2 text-lg text-gray-700 hover:bg-gray-100"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </Popover> */}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
