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

  const [confirmSendEmailModalOpen, setConfirmSendEmailModalOpen] = useState(false);
  const [successSendEmailAlertOpen, setSuccessSendEmailAlertOpen] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const handleSubmit = (data: Form) => {
    if (!captchaValue) {
      setCaptchaError('※ reCAPTCHAを完了してください');
      return;
    }

    setFormData(data);
    setConfirmSendEmailModalOpen(true);
  };

  const handleChangeCaptchaValue = (value: string | null) => {
    setCaptchaValue(value);

    if (value) {
      setCaptchaError('');
    }
  };

  const handleSendEmail = async () => {
    if (isSending || !formData) {
      return;
    }

    if (!captchaValue) {
      setCaptchaError('※ reCAPTCHAを完了してください');
      setConfirmSendEmailModalOpen(false);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_SENDEMAIL_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          'g-recaptcha-response': captchaValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessSendEmailAlertOpen(true);
        reset();
        recaptchaRef.current?.reset();
        setCaptchaValue(null);
        setCaptchaError('');
        setConfirmSendEmailModalOpen(false);
      } else {
        console.error(data.message ?? data.status);
      }
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (successSendEmailAlertOpen) {
      const timer = setTimeout(() => {
        setSuccessSendEmailAlertOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successSendEmailAlertOpen]);

  return (
    <>
      <p className="mt-5">
        本ブログに関するご質問やお気づきの点がございましたら、お気軽にお問い合わせください。
      </p>
      <form onSubmit={onSubmit(handleSubmit)} method="POST" className="pt-5 mb-5">
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
          onChange={handleChangeCaptchaValue}
          onExpired={() => setCaptchaValue(null)}
          className="mt-3"
        />
        {captchaError && <p className="text-red-500">{captchaError}</p>}
        <div className="mt-3">
          <button
            type="submit"
            disabled={isSending}
            className={`cursor-pointer block w-full rounded-md border px-3.5 py-2.5 text-center text-sm font-semibold shadow-s hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-wait disabled:opacity-70 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          >
            {isSending ? '送信中...' : '送信'}
          </button>
        </div>
      </form>

      <Modal
        show={confirmSendEmailModalOpen}
        title="お問い合わせを送信しますか？"
        description="送信ボタンは一度だけ押してください。送信完了まで数秒かかることがあります。"
        cancelText="キャンセル"
        confirmText={isSending ? '送信中...' : '送信'}
        isLoading={isSending}
        onConfirm={handleSendEmail}
        onClose={() => {
          if (!isSending) {
            setConfirmSendEmailModalOpen(false);
          }
        }}
      />

      <Alert
        show={successSendEmailAlertOpen}
        title="お問い合わせありがとうございます"
        description="正常に処理が完了しました。"
        onClose={() => setSuccessSendEmailAlertOpen(false)}
      />
    </>
  );
}
