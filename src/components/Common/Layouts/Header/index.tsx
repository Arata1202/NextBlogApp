'use client';

import { Fragment, useState } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FolderIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import ThemeSwitch from '@/components/Common/Layouts/ThemeSwitch';
import { BlogTitle } from '@/section/dummy';
import {
  headerNavigation,
  mobileTopNavigation,
  mobileBottomNavigation,
  categories,
} from '@/section/dummy';

export default function Header() {
  const { theme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`${styles.header} fixed top-0 left-0 w-full z-30 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <a href="/" className="-m-1.5 p-1.5 hover:scale-110 transition-transform">
            {BlogTitle.map((item) => (
              <img
                key={item.imageUrl}
                src={theme === 'dark' ? '/images/blog/title-dark.jpeg' : '/images/blog/title.webp'}
                alt={item.imageAlt}
                width={165}
                height={30}
              />
            ))}
          </a>
          <div className="flex lg:hidden">
            {mobileMenuOpen ? (
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-md p-2.5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            ) : (
              <div className="flex">
                <a
                  href="https://github.com/Arata1202/NextBlogApp"
                  target="_blank"
                  className="hover:text-blue-500 px-3"
                >
                  <svg fill="currentColor" viewBox="0 0 24 24" className="h-6 w-6">
                    <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.111 0.82-0.261 0.82-0.577 0-0.285-0.011-1.04-0.017-2.042-3.338 0.724-4.042-1.611-4.042-1.611-0.546-1.387-1.333-1.757-1.333-1.757-1.089-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.839 1.236 1.839 1.236 1.07 1.835 2.807 1.304 3.492 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.303-5.467-1.333-5.467-5.931 0-1.31 0.469-2.381 1.236-3.221-0.123-0.303-0.536-1.523 0.117-3.176 0 0 1.008-0.323 3.301 1.23 0.957-0.266 1.983-0.398 3.005-0.403 1.02 0.005 2.047 0.137 3.006 0.403 2.292-1.553 3.299-1.23 3.299-1.23 0.655 1.653 0.242 2.873 0.119 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.625-5.476 5.922 0.43 0.371 0.814 1.103 0.814 2.222 0 1.606-0.014 2.896-0.014 3.287 0 0.32 0.217 0.694 0.825 0.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <div
                  className={`inline-flex items-center justify-center rounded-md px-3 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                >
                  <ThemeSwitch />
                </div>
                <button
                  type="button"
                  className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ml-1 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>

          <div className="hidden lg:flex lg:gap-x-12 items-center">
            {headerNavigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex text-sm leading-6 hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </a>
            ))}
            <Popover className="relative">
              <Popover.Button
                className={`flex items-center text-sm font-medium hover:text-blue-500 focus:outline-none ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <FolderIcon className="h-5 w-5 mr-2" />
                カテゴリー
                <ChevronDownIcon className="h-5 w-5 ml-1" />
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
                <Popover.Panel
                  className={`absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-opacity-5 focus:outline-none  ${theme === 'dark' ? 'DarkTheme ring-gray-500' : 'LightTheme ring-gray-300'}`}
                >
                  <div className="py-1">
                    {categories.map((category) => (
                      <a
                        key={category.name}
                        href={category.href}
                        className={`block px-4 py-2 text-sm hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                      >
                        {category.name}
                      </a>
                    ))}
                  </div>
                </Popover.Panel>
              </Transition>
            </Popover>
            <ThemeSwitch />
            <a
              href="https://github.com/Arata1202/NextBlogApp"
              target="_blank"
              className="hover:text-blue-500"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="h-7 w-7">
                <path d="M12 0.297c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.111 0.82-0.261 0.82-0.577 0-0.285-0.011-1.04-0.017-2.042-3.338 0.724-4.042-1.611-4.042-1.611-0.546-1.387-1.333-1.757-1.333-1.757-1.089-0.745 0.083-0.729 0.083-0.729 1.205 0.084 1.839 1.236 1.839 1.236 1.07 1.835 2.807 1.304 3.492 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.303-5.467-1.333-5.467-5.931 0-1.31 0.469-2.381 1.236-3.221-0.123-0.303-0.536-1.523 0.117-3.176 0 0 1.008-0.323 3.301 1.23 0.957-0.266 1.983-0.398 3.005-0.403 1.02 0.005 2.047 0.137 3.006 0.403 2.292-1.553 3.299-1.23 3.299-1.23 0.655 1.653 0.242 2.873 0.119 3.176 0.769 0.84 1.235 1.911 1.235 3.221 0 4.609-2.805 5.625-5.476 5.922 0.43 0.371 0.814 1.103 0.814 2.222 0 1.606-0.014 2.896-0.014 3.287 0 0.32 0.217 0.694 0.825 0.576 4.765-1.589 8.199-6.085 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </nav>

        <Transition.Root show={mobileMenuOpen} as={Fragment}>
          <Dialog as="div" className="relative lg:hidden z-50" onClose={setMobileMenuOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-opacity-25" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="ease-in-out duration-500 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel
                className={`fixed inset-y-0 right-0 flex max-w-xs w-full shadow-xl  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <div className="flex w-full flex-col p-5">
                  <button
                    type="button"
                    className="-ml-2 flex items-center justify-end p-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <XMarkIcon
                      className={`h-6 w-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    />
                  </button>
                  <div
                    className={`text-center py-2 text-xl font-bold  ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-300'}`}
                  >
                    Menu
                  </div>
                  <ul className="mt-5 space-y-6">
                    {mobileTopNavigation.map((item) => (
                      <li key={item.name}>
                        <a href={item.href}>
                          <div
                            className={`flex items-center py-1 text-base font-bold border-b hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                          >
                            <div>▶︎</div>
                            <item.icon className="h-6 w-6 mr-2 ml-2" />
                            {item.name}
                          </div>
                        </a>
                      </li>
                    ))}
                    <div
                      className={`flex items-center py-1 text-base font-bold border-b  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    >
                      <div>▶︎</div>
                      <FolderIcon className="h-6 w-6 mr-2 ml-2" />
                      カテゴリー
                    </div>
                    {categories.map((item) => (
                      <li key={item.name}>
                        <a href={item.href}>
                          <div
                            className={`ml-5 flex items-center py-1 text-base font-bold border-b hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                          >
                            <div>{'>'}</div>
                            <item.icon className="h-6 w-6 mr-2 ml-2" />
                            {item.name}
                          </div>
                        </a>
                      </li>
                    ))}
                    {mobileBottomNavigation.map((item) => (
                      <li key={item.name}>
                        <a href={item.href}>
                          <div
                            className={`flex items-center py-1 text-base font-bold border-b hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                          >
                            <div>▶︎</div>
                            <item.icon className="h-6 w-6 mr-2 ml-2" />
                            {item.name}
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
      </header>
    </>
  );
}
