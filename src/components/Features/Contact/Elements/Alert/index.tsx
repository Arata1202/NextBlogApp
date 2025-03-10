import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

type Props = {
  onClose: () => void;
  show: boolean;
  title: string;
  description: string;
};

export default function Alert({ onClose, show, title, description }: Props) {
  const { theme } = useTheme();

  return (
    <div className="pointer-events-none fixed inset-0 flex items-start px-4 py-6 sm:items-start sm:p-6">
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          as={Fragment}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-opacity-5 mt-16 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p
                    className={`${styles.DialogTitle} font-semibold ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                  >
                    {title}
                  </p>
                  <p className={`${styles.DialogDescription} mt-1 text-gray-500`}>{description}</p>
                </div>
                <div className="ml-4 flex flex-shrink-0">
                  <button
                    type="button"
                    className={`inline-flex rounded-md hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
