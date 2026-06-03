'use client';

import { useEffect, useState } from 'react';
import {
  ArrowUturnLeftIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import styles from './index.module.css';
import { copyCodeText } from './copyCodeText';

type Props = {
  filename?: string;
  getCodeText: () => string;
  onWrappedChange: (wrapped: boolean) => void;
  wrapped: boolean;
};

const COPIED_STATE_RESET_MS = 2000;

type CopyState = 'idle' | 'copied' | 'failed';

export default function CodeBlockToolbar({
  filename,
  getCodeText,
  onWrappedChange,
  wrapped,
}: Props) {
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const Icon =
    copyState === 'copied'
      ? CheckIcon
      : copyState === 'failed'
        ? ExclamationCircleIcon
        : DocumentDuplicateIcon;
  const label =
    copyState === 'copied'
      ? 'コピー済み'
      : copyState === 'failed'
        ? 'コピーに失敗しました'
        : 'コードをコピー';
  const wrapLabel = wrapped ? 'コードの折り返しを解除' : 'コードを折り返す';

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => {
      setCopyState('idle');
    }, COPIED_STATE_RESET_MS);

    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleClick = async () => {
    try {
      await copyCodeText(getCodeText());
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="コードブロック操作">
      <div className={styles.meta}>
        {filename && (
          <span className={styles.filename} title={filename}>
            {filename}
          </span>
        )}
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.copyButton}
          aria-label={wrapLabel}
          aria-pressed={wrapped}
          data-active={String(wrapped)}
          data-tooltip={wrapLabel}
          onClick={() => onWrappedChange(!wrapped)}
        >
          <ArrowUturnLeftIcon className={styles.icon} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.copyButton}
          aria-label={label}
          data-state={copyState}
          data-tooltip={label}
          onClick={handleClick}
        >
          <Icon className={styles.icon} aria-hidden="true" />
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copyState === 'copied' ? 'コードをコピーしました' : ''}
        {copyState === 'failed' ? 'コードのコピーに失敗しました' : ''}
      </span>
    </div>
  );
}
