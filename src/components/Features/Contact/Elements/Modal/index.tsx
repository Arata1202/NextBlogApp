import { Fragment } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

type Props = {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cancelButtonRef: any;
};

export default function Modal({
  open,
  onClose,
  onConfirm,
  cancelButtonRef,
  title,
  description,
  cancelText,
  confirmText,
}: Props) {
  const { theme } = useTheme();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`m-auto relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                <div className="sm:flex sm:items-start">
                  <div
                    className={`${styles.Icon} mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h1"
                      className={`${styles.DialogTitle} font-bold leading-6 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className={`${styles.DialogDescription} text-gray-500`}>{description}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-flow-row-dense grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`${styles.CancelButton} mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ${theme === 'dark' ? 'DarkTheme hover:bg-gray-500' : 'LightTheme hover:bg-gray-50'}`}
                    onClick={onClose}
                    ref={cancelButtonRef}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:ml-3 sm:w-auto"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
