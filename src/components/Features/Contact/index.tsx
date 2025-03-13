'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import type { Form } from '@/types/form';
import InputContainer from './Elements/InputContainer';
import Modal from './Elements/Modal';
import Alert from './Elements/Alert';

export default function ContactFeature() {
  const { theme } = useTheme();

  const [show, setContactConfirmShow] = useState(false);
  const [open, setContactDialogOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [formData, setContactFormData] = useState<Form | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const onChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const onSubmit = (data: Form) => {
    setContactFormData(data);
    setContactDialogOpen(true);
  };

  const handleRecaptcha = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_RECAPTCHA_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'g-recaptcha-response': captchaValue,
      }),
    });

    const data = await response.json();

    if (data.success) {
      handleSendEmail();
    } else {
      console.error(data.message);
    }
  };

  const handleSendEmail = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SENDEMAIL_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      setContactConfirmShow(true);
      reset();
      recaptchaRef.current?.reset();
      setContactDialogOpen(false);
    } else {
      console.error(data.message);
    }
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
            className={`cursor-pointer block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-s border hover:border-2 hover:border-blue-500 hover:text-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            送信
          </button>
        </div>
      </form>

      <Modal
        title="お問い合わせを送信しますか？"
        description="送信ボタンは一度だけ押してください。送信完了まで数秒かかることがあります。"
        cancelText="キャンセル"
        confirmText="送信"
        onConfirm={handleRecaptcha}
        onClose={() => setContactDialogOpen(false)}
        open={open}
        cancelButtonRef={cancelButtonRef}
      />

      <Alert
        show={show}
        title="お問い合わせありがとうございます"
        description="正常に処理が完了しました。"
        onClose={() => setContactConfirmShow(false)}
      />
    </>
  );
}
