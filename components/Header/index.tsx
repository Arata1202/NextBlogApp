'use client';

import { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { FolderIcon } from '@heroicons/react/24/solid';
import { BlogTitle } from '@/Section/Dummy';
import {
  headerNavigation,
  mobileTopNavigation,
  mobileBottomNavigation,
  categories,
} from '@/Section/Dummy';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} fixed top-0 left-0 w-full bg-white z-30`}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="/" className="-m-1.5 p-1.5 hover:scale-110 transition-transform">
          <span className="sr-only">Your Company</span>
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
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
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
            <Dialog.Panel className="fixed inset-y-0 right-0 flex max-w-xs w-full bg-white shadow-xl">
              <div className="flex w-full flex-col p-5">
                <button
                  type="button"
                  className="-ml-2 flex items-center justify-end p-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6 text-gray-900" aria-hidden="true" />
                  <span className="sr-only">Close menu</span>
                </button>
                <div className="bg-gray-300 text-center py-2 text-xl font-bold">Menu</div>
                <ul className="mt-5 space-y-6">
                  {mobileTopNavigation.map((item) => (
                    <li key={item.name}>
                      <Link onClick={() => setMobileMenuOpen(false)} href={item.href}>
                        <div className="flex items-center py-1 text-base font-bold text-gray-900 border-b border-gray-300 hover:text-blue-500">
                          <div>▶︎</div>
                          <item.icon className="h-6 w-6 mr-2 ml-2" aria-hidden="true" />
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                  <div className="flex items-center py-1 text-base font-bold text-gray-900 border-b border-gray-300 hover:text-blue-500">
                    <div>▼</div>
                    <FolderIcon className="h-6 w-6 mr-2 ml-2" aria-hidden="true" />
                    カテゴリー
                  </div>
                  {categories.map((item) => (
                    <li key={item.name}>
                      <Link onClick={() => setMobileMenuOpen(false)} href={item.href}>
                        <div className="ml-5 flex items-center py-1 text-base font-medium text-gray-900 border-b border-gray-300 hover:text-blue-500">
                          <div>{'>'}</div>
                          <item.icon className="h-6 w-6 mr-2 ml-2" aria-hidden="true" />
                          {item.name}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {mobileBottomNavigation.map((item) => (
                    <li key={item.name}>
                      <Link onClick={() => setMobileMenuOpen(false)} href={item.href}>
                        <div className="flex items-center py-1 text-base font-bold text-gray-900 border-b border-gray-300 hover:text-blue-500">
                          <div>▶︎</div>
                          <item.icon className="h-6 w-6 mr-2 ml-2" aria-hidden="true" />
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
  );
}
