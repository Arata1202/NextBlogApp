import { Fragment } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { useTheme } from 'next-themes';
import styles from './index.module.css';
import { primaryButtonClassName } from '@/components/Common/controlClassNames';
import {
  colorClassNames,
  getThemeClassName,
  getThemeVariantClassName,
  radiusClassNames,
  shadowClassNames,
  themeVariantClassNames,
} from '@/styles/designTokens';

type Props = {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  show: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Modal({
  show,
  onClose,
  onConfirm,
  title,
  description,
  cancelText,
  confirmText,
  isLoading = false,
}: Props) {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);
  const controlHoverSurfaceClassName = getThemeVariantClassName(
    theme,
    themeVariantClassNames.controlHoverSurface,
  );

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" />
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
                className={`m-auto relative transform overflow-hidden ${radiusClassNames.dialog} px-4 pb-4 pt-5 text-left ${shadowClassNames.dialog} transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${themeClassName}`}
              >
                <div className="sm:flex sm:items-start">
                  <div
                    className={`${styles.Icon} mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    <EnvelopeIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h1"
                      className={`${styles.DialogTitle} font-bold leading-6 ${themeClassName}`}
                    >
                      {title}
                    </Dialog.Title>
                    <div className="mt-2">
                      <Dialog.Description
                        as="p"
                        className={`${styles.DialogDescription} ${colorClassNames.mutedText}`}
                      >
                        {description}
                      </Dialog.Description>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-flow-row-dense grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`${styles.CancelButton} mt-3 inline-flex w-full cursor-pointer justify-center ${radiusClassNames.control} px-3 py-2 text-sm font-semibold ${shadowClassNames.control} ring-1 ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:mt-0 sm:w-auto ${controlHoverSurfaceClassName} ${themeClassName}`}
                    onClick={onClose}
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    className={`${primaryButtonClassName} cursor-pointer sm:ml-3 sm:w-auto`}
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
