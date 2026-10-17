'use client';

import * as Sentry from '@sentry/nextjs';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';
import type { Form } from '@/types/form';
import InputContainer from './Elements/InputContainer';
import Modal from './Elements/Modal';
import Alert from './Elements/Alert';
import { outlinedControlClassName } from '@/components/Common/controlClassNames';
import { getApiSendEmailUrl, getTurnstileSiteKey } from '@/config/publicEnv';
import { getThemeClassName } from '@/styles/uiClassNames';

export default function ContactFeature() {
  const { theme } = useTheme();
  const themeClassName = getThemeClassName(theme);
  const apiSendEmailUrl = getApiSendEmailUrl();
  const turnstileSiteKey = getTurnstileSiteKey();
  const isFormConfigured = Boolean(apiSendEmailUrl && turnstileSiteKey);

  const [confirmSendEmailModalOpen, setConfirmSendEmailModalOpen] = useState(false);
  const [successSendEmailAlertOpen, setSuccessSendEmailAlertOpen] = useState(false);
  const [failureSendEmailAlertOpen, setFailureSendEmailAlertOpen] = useState(false);
  const [formData, setFormData] = useState<Form | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileValidationId, setTurnstileValidationId] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(undefined);
  const previousThemeRef = useRef(theme);
  const pendingSubmissionRef = useRef<{ payload: string; requestId: string } | null>(null);
  const turnstileErrorId = 'turnstile-error';

  const {
    register,
    handleSubmit: onSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>();

  useEffect(() => {
    if (previousThemeRef.current === theme) {
      return;
    }

    previousThemeRef.current = theme;
    setTurnstileToken(null);
    setTurnstileValidationId(null);
    setTurnstileError('');
  }, [theme]);

  const handleSubmit = (data: Form) => {
    if (!isFormConfigured) {
      setTurnstileError('※ お問い合わせフォームの設定が不足しています');
      return;
    }

    if (!turnstileToken || !turnstileValidationId) {
      setTurnstileError('※ セキュリティ検証を完了してください');
      return;
    }

    setFormData(data);
    setConfirmSendEmailModalOpen(true);
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileValidationId(crypto.randomUUID());
    setTurnstileError('');
  };

  const clearTurnstileValidation = () => {
    setTurnstileToken(null);
    setTurnstileValidationId(null);
  };

  const handleTurnstileError = () => {
    clearTurnstileValidation();
    setTurnstileError('※ セキュリティ検証に失敗しました。再読み込みしてください');
  };

  const handleSendEmail = async () => {
    if (isSending || !formData || !apiSendEmailUrl) {
      return;
    }

    if (!turnstileToken || !turnstileValidationId) {
      setTurnstileError('※ セキュリティ検証を完了してください');
      setConfirmSendEmailModalOpen(false);
      return;
    }

    setIsSending(true);

    const payload = JSON.stringify(formData);
    if (!pendingSubmissionRef.current || pendingSubmissionRef.current.payload !== payload) {
      pendingSubmissionRef.current = { payload, requestId: crypto.randomUUID() };
    }

    try {
      const response = await fetch(apiSendEmailUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requestId: pendingSubmissionRef.current.requestId,
          turnstileToken,
          turnstileValidationId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessSendEmailAlertOpen(true);
        setFailureSendEmailAlertOpen(false);
        reset();
        turnstileRef.current?.reset();
        clearTurnstileValidation();
        setTurnstileError('');
        pendingSubmissionRef.current = null;
        setConfirmSendEmailModalOpen(false);
      } else {
        if (response.status === 403) {
          turnstileRef.current?.reset();
          clearTurnstileValidation();
          pendingSubmissionRef.current = null;
        }

        const message = data.message ?? data.status ?? 'Contact request failed';

        Sentry.captureException(new Error(String(message)), {
          tags: {
            feature: 'contact',
          },
        });
        setSuccessSendEmailAlertOpen(false);
        setFailureSendEmailAlertOpen(true);
        setConfirmSendEmailModalOpen(false);
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: {
          feature: 'contact',
        },
      });
      setSuccessSendEmailAlertOpen(false);
      setFailureSendEmailAlertOpen(true);
      setConfirmSendEmailModalOpen(false);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (successSendEmailAlertOpen || failureSendEmailAlertOpen) {
      const timer = setTimeout(() => {
        setSuccessSendEmailAlertOpen(false);
        setFailureSendEmailAlertOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successSendEmailAlertOpen, failureSendEmailAlertOpen]);

  return (
    <>
      <div className="mt-5 space-y-2">
        <p>
          本ブログおよび運営中のアプリに関するご質問、不具合のご報告、ご意見・ご要望は、以下のフォームよりお問い合わせください。
        </p>
        <p>広告掲載やタイアップに関するご相談も受け付けています。</p>
        <p>アプリに関するお問い合わせは、件名にアプリ名をご記載ください。</p>
      </div>
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
        <div role="group" aria-describedby={turnstileError ? turnstileErrorId : undefined}>
          {turnstileSiteKey && (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={handleTurnstileSuccess}
              onExpire={clearTurnstileValidation}
              onError={handleTurnstileError}
              options={{
                action: 'contact',
                language: 'ja',
                responseField: false,
                theme: theme === 'dark' ? 'dark' : 'light',
              }}
              scriptOptions={{ onError: handleTurnstileError }}
              className="mt-3"
            />
          )}
        </div>
        {turnstileError && (
          <p id={turnstileErrorId} className="text-red-700" role="alert">
            {turnstileError}
          </p>
        )}
        <div className="mt-3">
          <button
            type="submit"
            disabled={isSending}
            className={`${outlinedControlClassName} block w-full cursor-pointer px-3.5 py-2.5 text-center text-sm font-semibold disabled:cursor-wait disabled:opacity-70 ${themeClassName}`}
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
      <Alert
        show={failureSendEmailAlertOpen}
        title="送信に失敗しました"
        description="時間をおいて再度お試しください。"
        variant="error"
        onClose={() => setFailureSendEmailAlertOpen(false)}
      />
    </>
  );
}
