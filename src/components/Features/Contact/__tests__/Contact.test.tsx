import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ContactFeature from '@/components/Features/Contact';

const recaptchaMock = vi.hoisted(() => ({
  reset: vi.fn(),
}));

vi.mock('react-google-recaptcha', async () => {
  const React = await import('react');

  type RecaptchaHandle = {
    reset: () => void;
  };

  type RecaptchaProps = {
    onChange?: (value: string | null) => void;
    className?: string;
  };

  const ReCAPTCHA = React.forwardRef<RecaptchaHandle, RecaptchaProps>(({ onChange }, ref) => {
    React.useImperativeHandle(ref, () => ({
      reset: recaptchaMock.reset,
    }));

    return React.createElement(
      'button',
      {
        type: 'button',
        onClick: () => onChange?.('captcha-token'),
      },
      'reCAPTCHA',
    );
  });

  ReCAPTCHA.displayName = 'MockReCAPTCHA';

  return {
    default: ReCAPTCHA,
  };
});

describe('ContactFeature', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    recaptchaMock.reset.mockReset();
    process.env.NEXT_PUBLIC_API_RECAPTCHA_URL = '/api/recaptcha';
    process.env.NEXT_PUBLIC_API_SENDEMAIL_URL = '/api/sendemail';
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = 'site-key';
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('shows a recaptcha validation message before opening the confirmation modal', async () => {
    const user = userEvent.setup();

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('※ reCAPTCHAを完了してください')).toBeInTheDocument();
    expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('confirms captcha, sends the email, resets the form, and shows success alert', async () => {
    const user = userEvent.setup();
    fetchMock
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      })
      .mockResolvedValueOnce({
        json: async () => ({ success: true }),
      });

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'reCAPTCHA' }));
    await user.click(screen.getByRole('button', { name: '送信' }));

    expect(await screen.findByText('お問い合わせを送信しますか？')).toBeInTheDocument();

    const confirmButtons = screen.getAllByRole('button', { name: '送信' });
    await user.click(confirmButtons[confirmButtons.length - 1]);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/api/recaptcha',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ 'g-recaptcha-response': 'captcha-token' }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/sendemail',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          title: 'Test subject',
          message: 'Test message',
        }),
      }),
    );
    expect(await screen.findByText('お問い合わせありがとうございます')).toBeInTheDocument();
    expect(recaptchaMock.reset).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('メールアドレス')).toHaveValue('');
    await waitFor(() => {
      expect(screen.queryByText('お問い合わせを送信しますか？')).not.toBeInTheDocument();
    });
  });

  it('does not send email when captcha verification fails', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ success: false, message: 'captcha failed' }),
    });

    render(<ContactFeature />);

    await user.type(screen.getByLabelText('メールアドレス'), 'test@example.com');
    await user.type(screen.getByLabelText('件名'), 'Test subject');
    await user.type(screen.getByLabelText('内容'), 'Test message');
    await user.click(screen.getByRole('button', { name: 'reCAPTCHA' }));
    await user.click(screen.getByRole('button', { name: '送信' }));
    await user.click((await screen.findAllByRole('button', { name: '送信' })).at(-1)!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/recaptcha',
      expect.objectContaining({
        body: JSON.stringify({ 'g-recaptcha-response': 'captcha-token' }),
      }),
    );
    expect(screen.queryByText('お問い合わせありがとうございます')).not.toBeInTheDocument();
    expect(recaptchaMock.reset).not.toHaveBeenCalled();

    consoleError.mockRestore();
  });
});
