'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './index.module.css';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { HomeIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

const headerNavigation = [
  { name: 'ホーム', href: '#', icon: HomeIcon },
  { name: 'プロフィール', href: '#', icon: UserIcon },
  { name: 'お問い合わせ', href: '#', icon: EnvelopeIcon },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`${styles.header} fixed top-0 left-0 w-full bg-white z-30`}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <Image width={165} height={30} src="/images/blog/title.jpg" alt="ブログタイトル" />
        </a>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
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
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
                {headerNavigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="mt-10 flex text-sm leading-6 text-gray-900 hover:text-blue-500"
                  >
                    <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
