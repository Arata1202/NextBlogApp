'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import type { Form } from '@/types/form';
import InputContainer from './Elements/InputContainer';
import Modal from './Elements/Modal';
import Alert from './Elements/Alert';
import { outlinedControlClassName } from '@/components/Common/controlClassNames';
import { getApiSendEmailUrl, getRecaptchaSiteKey } from '@/config/publicEnv';

export default function ContactFeature() {
  const { theme } = useTheme();
  const apiSendEmailUrl = getApiSendEmailUrl();
  const recaptchaSiteKey = getRecaptchaSiteKey();
  const isFormConfigured = Boolean(apiSendEmailUrl && recaptchaSiteKey);

  const [confirmSendEmailModalOpen, setConfirmSendEmailModalOpen] = useState(false);
  const [successSendEmailAlertOpen, setSuccessSendEmailAlertOpen] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const captchaErrorId = 'recaptcha-error';

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  const handleSubmit = (data: Form) => {
    if (!isFormConfigured) {
      setCaptchaError('※ お問い合わせフォームの設定が不足しています');
      return;
    }

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
    if (isSending || !formData || !apiSendEmailUrl) {
      return;
    }

    if (!captchaValue) {
      setCaptchaError('※ reCAPTCHAを完了してください');
      setConfirmSendEmailModalOpen(false);
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(apiSendEmailUrl, {
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
        const message = data.message ?? data.status ?? 'Contact request failed';

        Sentry.captureException(new Error(String(message)), {
          tags: {
            feature: 'contact',
          },
        });
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          feature: 'contact',
        },
      });
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
        <div role="group" aria-describedby={captchaError ? captchaErrorId : undefined}>
          {recaptchaSiteKey && (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={recaptchaSiteKey}
              onChange={handleChangeCaptchaValue}
              onExpired={() => setCaptchaValue(null)}
              className="mt-3"
            />
          )}
        </div>
        {captchaError && (
          <p id={captchaErrorId} className="text-red-700" role="alert">
            {captchaError}
          </p>
        )}
        <div className="mt-3">
          <button
            type="submit"
            disabled={isSending}
            className={`${outlinedControlClassName} block w-full cursor-pointer px-3.5 py-2.5 text-center text-sm font-semibold disabled:cursor-wait disabled:opacity-70 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
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
