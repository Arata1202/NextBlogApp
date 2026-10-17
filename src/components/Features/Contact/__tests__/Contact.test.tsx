import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactFeature from '@/components/Features/Contact';

const turnstileMock = vi.hoisted(() => ({
  reset: vi.fn(),
}));

const themeMock = vi.hoisted(() => ({
  theme: 'light',
}));

const sentryMock = vi.hoisted(() => ({
  captureException: vi.fn(),
}));

vi.mock('@sentry/nextjs', () => sentryMock);
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: themeMock.theme }),
}));

vi.mock('@marsidev/react-turnstile', async () => {
  const React = await import('react');

  type TurnstileHandle = {
    reset: () => void;
  };

  type TurnstileProps = {
    onSuccess?: (token: string) => void;
    onError?: () => void;
    options?: { theme?: string };
    className?: string;
  };

  const Turnstile = React.forwardRef<TurnstileHandle, TurnstileProps>(
    ({ onSuccess, onError, options }, ref) => {
      React.useImperativeHandle(ref, () => ({
        reset: turnstileMock.reset,
      }));

      return React.createElement(
        'div',
        { 'data-theme': options?.theme },
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => onSuccess?.('turnstile-token'),
          },
          'Turnstile',
        ),
        React.createElement(
          'button',
          {
            type: 'button',
            onClick: () => onError?.(),
          },
          'Turnstile error',
        ),
      );
    },
  );

  Turnstile.displayName = 'MockTurnstile';

  return { Turnstile };
});

describe('ContactFeature', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    turnstileMock.reset.mockReset();
    sentryMock.captureException.mockReset();
    themeMock.theme = 'light';
    process.env.NEXT_PUBLIC_API_SENDEMAIL_URL = '/api/sendemail';
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = 'site-key';
    vi.spyOn(globalThis.crypto, 'randomUUID')
      .mockReturnValueOnce('11111111-1111-4111-8111-111111111111')
      .mockReturnValue('00000000-0000-4000-8000-000000000001');
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('shows guidance for blog, app, and business inquiries', () => {
    render(<ContactFeature />);

    expect(
      screen.getByText(
        '本ブログおよび運営中のアプリに関するご質問、不具合のご報告、ご意見・ご要望は、以下のフォームよりお問い合わせください。',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('広告掲載やタイアップに関するご相談も受け付けています。'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('アプリに関するお問い合わせは、件名にアプリ名をご記載ください。'),
    ).toBeInTheDocument();
  });

  it('shows validation messages and does not call the API when required fields are empty', async () => {
    const user = userEvent.setup();

    render(<ContactFeature />);

    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('※ メールアドレスを入力してください')).toBeInTheDocument();
    expect(screen.getByText('※ 件名を入力してください')).toBeInTheDocument();
    expect(screen.getByText('※ 内容を入力してください')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows an email format validation message before opening the confirmation modal', async () => {
    const user = userEvent.setup();

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'invalid-email');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('※ 有効なメールアドレスを入力してください')).toBeInTheDocument();
    expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows a Turnstile validation message before opening the confirmation modal', async () => {
    const user = userEvent.setup();

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('※ セキュリティ検証を完了してください')).toBeInTheDocument();
    expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not open the confirmation modal when public form settings are missing', async () => {
    const user = userEvent.setup();
    delete process.env.NEXT_PUBLIC_API_SENDEMAIL_URL;
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(
      await screen.findByText('※ お問い合わせフォームの設定が不足しています'),
    ).toBeInTheDocument();
    expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows an actionable error when the Turnstile widget reports an error', async () => {
    const user = userEvent.setup();

    render(<ContactFeature />);

    await user.click(screen.getByRole('button', { name: 'Turnstile error' }));

    expect(
      await screen.findByText('※ セキュリティ検証に失敗しました。再読み込みしてください'),
    ).toBeInTheDocument();
  });

  it('requires a fresh Turnstile token after the site theme changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ContactFeature />);

    await user.click(screen.getByRole('button', { name: 'Turnstile' }));

    themeMock.theme = 'dark';
    rerender(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('※ セキュリティ検証を完了してください')).toBeInTheDocument();
    expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    expect(document.querySelector('[data-theme="dark"]')).toBeInTheDocument();
  });

  it('confirms Turnstile, sends the email, resets the form, and shows success alert', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'Turnstile' }));
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('お問い合わせを送信しますか？')).toBeInTheDocument();

    const confirmButtons = screen.getAllByRole('button', { name: '送信' });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/sendemail',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          title: 'Test subject',
          message: 'Test message',
          requestId: '00000000-0000-4000-8000-000000000001',
          turnstileToken: 'turnstile-token',
          turnstileValidationId: '11111111-1111-4111-8111-111111111111',
        }),
      }),
    );
    expect(await screen.findByText('お問い合わせありがとうございます')).toBeInTheDocument();
    expect(turnstileMock.reset).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('メールアドレス')).toHaveValue('');
    await waitFor(() => {
      expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    });
  });

  it('resets Turnstile when the API rejects its token', async () => {
    const user = userEvent.setup();
    fetchMock.mockResolvedValueOnce({
      status: 403,
      json: async () => ({ success: false, status: 'Turnstile verification failed' }),
    });

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'Turnstile' }));
    await user.click(screen.getByRole('button', { name: '送信' }));
    await user.click((await screen.findAllByRole('button', { name: '送信' })).at(-1)!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/sendemail',
      expect.objectContaining({
        body: JSON.stringify({
          email: 'test@example.com',
          title: 'Test subject',
          message: 'Test message',
          requestId: '00000000-0000-4000-8000-000000000001',
          turnstileToken: 'turnstile-token',
          turnstileValidationId: '11111111-1111-4111-8111-111111111111',
        }),
      }),
    );
    expect(screen.queryByText('お問い合わせありがとうございます')).not.toBeInTheDocument();
    expect(await screen.findByText('送信に失敗しました')).toBeInTheDocument();
    expect(screen.getByText('時間をおいて再度お試しください。')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('送信に失敗しました');
    expect(turnstileMock.reset).toHaveBeenCalledTimes(1);
    expect(sentryMock.captureException).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    });
  });

  it('reuses the request ID when retrying the same failed submission', async () => {
    const user = userEvent.setup();
    fetchMock
      .mockResolvedValueOnce({
        json: async () => ({ success: false, status: 'temporary failure' }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      });

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'Turnstile' }));

    await user.click(screen.getByRole('button', { name: '送信' }));
    await user.click((await screen.findAllByRole('button', { name: '送信' })).at(-1)!);
    expect(await screen.findByText('送信に失敗しました')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: '送信' }));
    await user.click((await screen.findAllByRole('button', { name: '送信' })).at(-1)!);
    expect(await screen.findByText('お問い合わせありがとうございます')).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const firstBody = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    const secondBody = JSON.parse(fetchMock.mock.calls[1][1].body as string);
    expect(firstBody.requestId).toBe('00000000-0000-4000-8000-000000000001');
    expect(secondBody.requestId).toBe(firstBody.requestId);
    expect(secondBody.turnstileValidationId).toBe(firstBody.turnstileValidationId);
    expect(globalThis.crypto.randomUUID).toHaveBeenCalledTimes(2);
  });

  it('shows a failure alert when the email request fails', async () => {
    const user = userEvent.setup();
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'Turnstile' }));
    await user.click(screen.getByRole('button', { name: '送信' }));
    await user.click((await screen.findAllByRole('button', { name: '送信' })).at(-1)!);

    expect(await screen.findByText('送信に失敗しました')).toBeInTheDocument();
    expect(screen.getByText('時間をおいて再度お試しください。')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('送信に失敗しました');
    expect(screen.queryByText('お問い合わせありがとうございます')).not.toBeInTheDocument();
    expect(turnstileMock.reset).not.toHaveBeenCalled();
    expect(sentryMock.captureException).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    });
  });
});
