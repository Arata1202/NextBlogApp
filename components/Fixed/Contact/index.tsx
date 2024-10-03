'use client';

import React, { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import ReCAPTCHA from 'react-google-recaptcha';
import Share from '../../Elements/Share';
import AdAlert from '../../Articles/AdAlert';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';
import PublishedDate from '@/components/Elements/Date';
import Display from '../../Adsense/Display';

const ContactPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [show, setContactConfirmShow] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [formData, setContactFormData] = useState<FormData | null>(null);
  const [open, setContactDialogOpen] = useState(false);

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  interface FormData {
    sei: string;
    mei: string;
    email: string;
    company: string;
    tel: string;
    message: string;
  }

  const resetCaptcha = useCallback(() => {
    recaptchaRef.current?.reset();
  }, []);

  const onChange = (value: string | null) => {
    console.log('Captcha value:', value);
    setCaptchaValue(value);
  };

  const onSubmit = (data: FormData) => {
    setContactFormData(data);
    setContactDialogOpen(true);
  };

  const sendEmail = useCallback(() => {
    if (!formData) return;

    fetch('${process.env.NEXT_PUBLIC_LAMBDA_EMAIL_ENDPOINT}', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('Email sent successfully');
          setContactConfirmShow(true);
          reset();
          resetCaptcha();
          setContactDialogOpen(false);
        } else {
          console.log('Failed to send email');
          setContactConfirmShow(false);
        }
      })
      .catch((error) => console.error('Error sending email:', error));
  }, [formData, reset, resetCaptcha]);

  const handleConfirmSend = useCallback(() => {
    const verifyCaptcha = async () => {
      try {
        const response = await fetch(
          '${process.env.NEXT_PUBLIC_LAMBDA_RECAPTCHA_ENDPOINT}',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `g-recaptcha-response=${captchaValue}`,
          },
        );
        const data = await response.json();
        if (data.success) {
          sendEmail();
        } else {
          console.error('reCAPTCHA validation failed:', data.message);
        }
      } catch (error) {
        console.error('Error during reCAPTCHA validation:', error);
      }
    };

    verifyCaptcha();
  }, [captchaValue, sendEmail]);

  const handleCancel = () => {
    setContactDialogOpen(false);
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setContactConfirmShow(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <>
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="FirstAd">
              <Display slot="7197259627" />
            </div>
            <div className="">
              <div className="space-y-5 lg:space-y-8">
                <div className="includeBanner flex justify-end gap-x-5">
                  {/* <TagList tags={data.tags} /> */}
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
              </div>
              <p className="mt-5">
                当ブログに関するご質問やお気づきの点がございましたら、お気軽にお問い合わせください。
                お問い合わせから2～3日中にはご返信させていただきます。
              </p>
              <form onSubmit={handleSubmit(onSubmit)} method="POST" className="pt-5 mb-5">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-semibold leading-6 text-gray-800"
                    >
                      氏名
                    </label>
                    <div className="mt-2.5">
                      <input
                        {...register('sei', { required: '※ 氏名を入力してください' })}
                        type="text"
                        name="sei"
                        id="sei"
                        autoComplete="given-name"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                      {errors.sei && <p className="text-red-500">{errors.sei.message}</p>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-semibold leading-6 text-gray-800"
                    >
                      題名
                    </label>
                    <div className="mt-2.5">
                      <input
                        {...register('mei', { required: '※ 題名を入力してください' })}
                        type="text"
                        name="mei"
                        id="mei"
                        autoComplete="family-name"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                      {errors.mei && <p className="text-red-500">{errors.mei.message}</p>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold leading-6 text-gray-800"
                    >
                      メールアドレス
                    </label>
                    <div className="mt-2.5">
                      <input
                        {...register('email', {
                          required: '※ メールアドレスを入力してください',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: '※ 有効なメールアドレスを入力してください',
                          },
                        })}
                        type="text"
                        name="email"
                        id="email"
                        autoComplete="email"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold leading-6 text-gray-800"
                    >
                      内容
                    </label>
                    <div className="mt-2.5">
                      <textarea
                        {...register('message', { required: '※ 内容を入力してください' })}
                        name="message"
                        id="message"
                        rows={4}
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 text-gray-800 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                        defaultValue={''}
                      />
                      {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                    </div>
                  </div>
                </div>
                {/* スパム */}
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LcslaspAAAAAA15eqFJy4_vL856A7uu4ANjeqId"
                  onChange={onChange}
                  className="mt-3"
                />
                <div className="mt-3">
                  <button
                    type="submit"
                    disabled={!captchaValue}
                    className="block w-full rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-s border border-gray-300 hover:text-blue-500"
                  >
                    送信
                  </button>
                </div>
              </form>
              <div className="FirstAd">
                <Display slot="1831092739" />
              </div>
              <Share />
            </div>
          </div>
          <div className="mobile">
            <FixedSidebar articles={sidebarArticles.contents} />
          </div>
        </div>
      </div>
      {/* 送信確認モーダル */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setContactDialogOpen}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <EnvelopeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h1"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        お問い合わせを送信しますか？
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          お問い合わせの内容は、ブログの運営者に送信されます。
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleCancel}
                      ref={cancelButtonRef}
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={handleConfirmSend}
                    >
                      送信
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* 送信完了アラート */}
      <div
        aria-live="assertive"
        className="confirmAlert pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
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
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 mt-16">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      お問い合わせありがとうございます
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      数日以内にご連絡いたしますので、しばらくお待ちください。
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setContactConfirmShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
