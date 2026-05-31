'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, type ElementType, type RefObject } from 'react';
import { useTheme } from 'next-themes';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { IoAirplane } from 'react-icons/io5';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import {
  AcademicCapIcon as AcademicCapSolidIcon,
  BookOpenIcon as BookOpenSolidIcon,
  BriefcaseIcon as BriefcaseSolidIcon,
  CommandLineIcon as CommandLineSolidIcon,
  FolderIcon,
  SparklesIcon as SparklesSolidIcon,
} from '@heroicons/react/24/solid';
import styles from './index.module.css';
import ThemeSwitch from '@/components/Common/Layouts/ThemeSwitch';
import { BLOG_IMAGE } from '@/constants/data';
import { HEADER_NAVIGATION } from '@/constants/data';
import { CATEGORY_ARR } from '@/constants/category';
import { GitHubIcon } from '../../Elements/SocialIcon';
import Banner from './Elements/Banner';
import {
  compactIconControlClassName,
  interactiveFocusClassName,
} from '@/components/Common/controlClassNames';

type Category = (typeof CATEGORY_ARR)[number];

const HEADER_CATEGORY_ICONS: Record<string, ElementType> = {
  university: AcademicCapSolidIcon,
  work: BriefcaseSolidIcon,
  leisure: SparklesSolidIcon,
  travel: IoAirplane,
  programming: CommandLineSolidIcon,
  blog: BookOpenSolidIcon,
};

type CloseOnOutsideClickProps = {
  enabled: boolean;
  rootRef: RefObject<HTMLElement | null>;
  onClose: () => void;
};

function CloseOnOutsideClick({ enabled, rootRef, onClose }: CloseOnOutsideClickProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node) || rootRef.current?.contains(target)) {
        return;
      }

      onClose();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [enabled, onClose, rootRef]);

  return null;
}

type HeaderCategoryIconProps = {
  category: Category;
  className: string;
};

function HeaderCategoryIcon({ category, className }: HeaderCategoryIconProps) {
  const Icon = HEADER_CATEGORY_ICONS[category.id] ?? category.icon;

  return <Icon className={className} aria-hidden="true" />;
}

export default function Header() {
  const { theme } = useTheme();
  const categoryPopoverRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const themeClassName = theme === 'dark' ? 'DarkTheme' : 'LightTheme';
  const headerLinkClassName = `flex text-sm leading-6 hover:text-blue-600 ${interactiveFocusClassName} ${themeClassName}`;
  const menuLinkClassName = `flex items-center py-1 text-base font-bold border-b hover:text-blue-600 ${interactiveFocusClassName} ${themeClassName}`;
  const categoryMenuLinkClassName = `ml-5 flex items-center py-1 text-base font-bold border-b hover:text-blue-600 ${interactiveFocusClassName} ${themeClassName}`;
  const popoverMenuLinkClassName = `relative z-0 flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:text-blue-600 focus-visible:z-10 ${interactiveFocusClassName} ${themeClassName}`;
  const githubLinkClassName = `rounded-md hover:text-blue-600 ${interactiveFocusClassName}`;
  const mobileGithubLinkClassName = `${compactIconControlClassName} hover:text-blue-600`;

  return (
    <>
      <header className={`${styles.header} fixed top-0 left-0 w-full z-30 ${themeClassName}`}>
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
          aria-label="グローバルナビゲーション"
        >
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
                aria-label="メニューを閉じる"
                className={`${compactIconControlClassName} cursor-pointer ${themeClassName}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            ) : (
              <div className="flex">
                <div className={`inline-flex items-center justify-center px-3 ${themeClassName}`}>
                  <Link
                    href="https://github.com/Arata1202/NextBlogApp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={mobileGithubLinkClassName}
                    aria-label="GitHubリポジトリを新しいタブで開く"
                  >
                    <GitHubIcon className="h-6 w-6" aria-hidden="true" />
                  </Link>
                </div>
                <div
                  className={`inline-flex items-center justify-center rounded-md px-3 ${themeClassName}`}
                >
                  <ThemeSwitch />
                </div>
                <div className="-m-2.5 ml-1 flex items-center justify-center p-2.5">
                  <button
                    type="button"
                    aria-label="メニューを開く"
                    className={`${compactIconControlClassName} cursor-pointer ${themeClassName}`}
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:flex lg:gap-x-12 items-center">
            {HEADER_NAVIGATION.map((item) => (
              <Link key={item.name} href={item.path} className={headerLinkClassName}>
                <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
            <Popover ref={categoryPopoverRef} className="relative">
              {({ open, close }) => (
                <>
                  <CloseOnOutsideClick
                    enabled={open}
                    rootRef={categoryPopoverRef}
                    onClose={close}
                  />
                  <Popover.Button
                    className={`flex cursor-pointer items-center text-sm font-medium hover:text-blue-600 ${interactiveFocusClassName} ${themeClassName}`}
                  >
                    <FolderIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    カテゴリー
                    <ChevronDownIcon className="h-5 w-5 ml-1" aria-hidden="true" />
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
                      className={`absolute z-10 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ${theme === 'dark' ? 'DarkTheme ring-gray-500/5' : 'LightTheme ring-gray-300/5'}`}
                    >
                      <div className="p-1">
                        {CATEGORY_ARR.map((item) => (
                          <Link
                            key={item.name}
                            href={`/category/${item.id}`}
                            className={popoverMenuLinkClassName}
                            onClick={() => {
                              close();
                            }}
                          >
                            <HeaderCategoryIcon category={item} className="h-5 w-5 shrink-0" />
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
              rel="noopener noreferrer"
              className={githubLinkClassName}
              aria-label="GitHubリポジトリを新しいタブで開く"
            >
              <GitHubIcon className="h-7 w-7" aria-hidden="true" />
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
              <div className="fixed inset-0" aria-hidden="true" />
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
                className={`fixed inset-y-0 right-0 flex max-w-xs w-full shadow-xl ${themeClassName}`}
              >
                <div className="flex w-full flex-col p-5">
                  <div className="-ml-2 flex justify-end p-2">
                    <button
                      type="button"
                      aria-label="メニューを閉じる"
                      className={`${compactIconControlClassName} cursor-pointer`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <XMarkIcon className={`h-6 w-6 ${themeClassName}`} aria-hidden="true" />
                    </button>
                  </div>
                  <Dialog.Title
                    className={`text-center py-2 text-xl font-bold  ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-300'}`}
                  >
                    Menu
                  </Dialog.Title>
                  <ul className="mt-5 space-y-6">
                    {HEADER_NAVIGATION.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.path}
                          className={menuLinkClassName}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <item.icon className="h-6 w-6 mx-2" aria-hidden="true" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-2">
                      <p
                        className={`flex items-center gap-2 text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                      >
                        <FolderIcon className="h-4 w-4" aria-hidden="true" />
                        カテゴリー
                      </p>
                    </li>
                    {CATEGORY_ARR.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={`/category/${item.id}`}
                          className={categoryMenuLinkClassName}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ChevronRightIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <HeaderCategoryIcon category={item} className="h-6 w-6 mx-2 shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition.Root>
        <Banner />
      </header>
    </>
  );
}
