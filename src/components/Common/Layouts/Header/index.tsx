'use client';

import Link from 'next/link';
import { Fragment, useState } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FolderIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';
import ThemeSwitch from '@/components/Common/Layouts/ThemeSwitch';
import { BLOG_IMAGE } from '@/constants/data';
import { HEADER_NAVIGATION } from '@/constants/data';
import { CATEGORY_ARR } from '@/constants/category';
import { GitHubIcon } from '../../Elements/SocialIcon';

export default function Header() {
  const { theme } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`${styles.header} fixed top-0 left-0 w-full z-30 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <Link href="/" className="-m-1.5 p-1.5 hover:scale-110 transition-transform">
            {BLOG_IMAGE.map((item) => (
              <img
                key={item.alt}
                src={theme === 'dark' ? item.path.dark : item.path.light}
                alt={item.alt}
                width={165}
                height={30}
              />
            ))}
          </Link>
          <div className="flex lg:hidden">
            {mobileMenuOpen ? (
              <button
                type="button"
                className={`inline-flex items-center justify-center rounded-md ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            ) : (
              <div className="flex">
                <Link
                  href="https://github.com/Arata1202/NextBlogApp"
                  target="_blank"
                  className="hover:text-blue-500 px-3"
                >
                  <GitHubIcon className="h-6 w-6" />
                </Link>
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
            {HEADER_NAVIGATION.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex text-sm leading-6 hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
            <Popover className="relative">
              {({ close }) => (
                <>
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
                        {CATEGORY_ARR.map((item) => (
                          <Link
                            key={item.name}
                            href={`/category/${item.id}`}
                            className={`block px-4 py-2 text-sm hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                            onClick={() => {
                              close();
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
            <ThemeSwitch />
            <Link
              href="https://github.com/Arata1202/NextBlogApp"
              target="_blank"
              className="hover:text-blue-500"
            >
              <GitHubIcon className="h-7 w-7" />
            </Link>
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
                    {HEADER_NAVIGATION.map((item) => (
                      <li key={item.name}>
                        <Link href={item.path}>
                          <div
                            className={`flex items-center py-1 text-base font-bold border-b hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div>▶︎</div>
                            <item.icon className="h-6 w-6 mx-2" />
                            {item.name}
                          </div>
                        </Link>
                      </li>
                    ))}
                    <div
                      className={`flex items-center py-1 text-base font-bold border-b  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    >
                      <div>▶︎</div>
                      <FolderIcon className="h-6 w-6 mx-2" />
                      カテゴリー
                    </div>
                    {CATEGORY_ARR.map((item) => (
                      <li key={item.name}>
                        <Link href={`/category/${item.id}`}>
                          <div
                            className={`ml-5 flex items-center py-1 text-base font-bold border-b hover:text-blue-500  ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div>{'>'}</div>
                            <FolderOpenIcon className="h-6 w-6 mx-2" />
                            {item.name}
                          </div>
                        </Link>
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
