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
                className={`-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            ) : (
              <div className="flex">
                <div
                  className={`-m-2.5 inline-flex items-center justify-center rounded-md p-3 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
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

          <div className="hidden lg:flex lg:gap-x-12">
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
