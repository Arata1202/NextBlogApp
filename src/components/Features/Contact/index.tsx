'use client';

import { useState, useEffect, useRef, useCallback, Fragment } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { Transition } from '@headlessui/react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ReCAPTCHA from 'react-google-recaptcha';
import { Article } from '@/types/microcms';
import type { Form } from '@/types/form';
import styles from './index.module.css';
import AdUnit from '@/components/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import FixedDateContainer from '@/components/Common/Layouts/Container/FIxedDateContainer';
import InputContainer from './Elements/InputContainer';
import Modal from './Elements/Modal';

type Props = {
  articles: Article[];
};

export default function ContactFeature({ articles }: Props) {
  const { theme } = useTheme();

  const date = new Date(2023, 10, 27);

  const [show, setContactConfirmShow] = useState(false);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [formData, setContactFormData] = useState<Form | null>(null);
  const [open, setContactDialogOpen] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const resetCaptcha = useCallback(() => {
    recaptchaRef.current?.reset();
  }, []);

  const onChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const onSubmit = (data: Form) => {
    setContactFormData(data);
    setContactDialogOpen(true);
  };

  const sendEmail = useCallback(() => {
    if (!formData) return;

    fetch(`${process.env.NEXT_PUBLIC_API_SENDEMAIL_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setContactConfirmShow(true);
          reset();
          resetCaptcha();
          setContactDialogOpen(false);
        } else {
          setContactConfirmShow(false);
        }
      })
      .catch((error) => console.error(error));
  }, [formData, reset, resetCaptcha]);

  const handleConfirmSend = useCallback(() => {
    const verifyCaptcha = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_RECAPTCHA_URL}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'g-recaptcha-response': captchaValue,
          }),
        });
        const data = await response.json();
        if (data.success) {
          sendEmail();
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
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
      <MainContainer>
        <ContentContainer>
          <FixedDateContainer date={date} />
          <p className="mt-5">
            本ブログに関するご質問やお気づきの点がございましたら、お気軽にお問い合わせください。
          </p>
          <form onSubmit={handleSubmit(onSubmit)} method="POST" className="pt-5 mb-5">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <InputContainer
                label="メールアドレス"
                name="email"
                registerResult={register('email', {
                  required: '※ メールアドレスを入力してください',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: '※ 有効なメールアドレスを入力してください',
                  },
                })}
                errors={errors.email}
              />
              <InputContainer
                label="件名"
                name="title"
                registerResult={register('title', { required: '※ 件名を入力してください' })}
                errors={errors.title}
              />
              <InputContainer
                textarea={true}
                label="内容"
                name="message"
                registerResult={register('message', { required: '※ 内容を入力してください' })}
                errors={errors.message}
              />
            </div>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={`${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
              onChange={onChange}
              className="mt-3"
            />
            <div className="mt-3">
              <button
                type="submit"
                disabled={!captchaValue}
                className={`cursor-pointer block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-s border hover:border-2 hover:border-blue-500 hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
              >
                送信
              </button>
            </div>
          </form>
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} />
      </MainContainer>

      <Modal
        title="お問い合わせを送信しますか？"
        description="送信ボタンは一度だけ押してください。送信完了まで数秒かかることがあります。"
        cancelText="キャンセル"
        confirmText="送信"
        onConfirm={handleConfirmSend}
        onClose={handleCancel}
        open={open}
        cancelButtonRef={cancelButtonRef}
      />

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
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p
                      className={`${styles.DialogTitle} font-semibold ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
                    >
                      お問い合わせありがとうございます
                    </p>
                    <p className={`${styles.DialogDescription} mt-1 text-gray-500`}>
                      正常に処理が完了しました。
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className={`inline-flex rounded-md hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
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
}
