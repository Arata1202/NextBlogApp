import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Alert from '../index';

describe('Contact Alert', () => {
  it('appears below the current header without the removed banner offset', () => {
    render(
      <Alert
        show
        title="送信しました"
        description="お問い合わせを受け付けました"
        onClose={vi.fn()}
      />,
    );

    const alert = screen.getByRole('status');

    expect(alert).toHaveClass('mt-16');
    expect(alert).not.toHaveClass('mt-24');
  });

  it('closes from the dismiss button', () => {
    const onClose = vi.fn();

    render(
      <Alert
        show
        title="送信しました"
        description="お問い合わせを受け付けました"
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '通知を閉じる' }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
