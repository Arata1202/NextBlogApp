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
  const [result, setResult] = useState<{ state: CopyState }>({ state: 'idle' });
  const copyState = result.state;
  const { Icon, label } = {
    idle: { Icon: DocumentDuplicateIcon, label: 'コードをコピー' },
    copied: { Icon: CheckIcon, label: 'コピー済み' },
    failed: { Icon: ExclamationCircleIcon, label: 'コピーに失敗しました' },
  }[copyState];
  const wrapLabel = wrapped ? 'コードの折り返しを解除' : 'コードを折り返す';

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => {
      setResult({ state: 'idle' });
    }, COPIED_STATE_RESET_MS);

    return () => window.clearTimeout(timer);
  }, [result, copyState]);

  const handleClick = async () => {
    try {
      await copyCodeText(getCodeText());
      setResult({ state: 'copied' });
    } catch {
      setResult({ state: 'failed' });
    }
  };

  return (
    <div className={styles.toolbar} role="group" aria-label="コードブロック操作">
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
          aria-label="コードを折り返す"
          aria-pressed={wrapped}
          data-active={String(wrapped)}
          data-tooltip={wrapLabel}
          onClick={() => onWrappedChange(!wrapped)}
        >
          <span className={styles.iconFrame} aria-hidden="true">
            <ArrowUturnLeftIcon className={styles.icon} />
          </span>
        </button>
        <button
          type="button"
          className={styles.copyButton}
          aria-label={label}
          data-state={copyState}
          data-tooltip={label}
          onClick={handleClick}
        >
          <span className={styles.iconFrame} aria-hidden="true">
            <Icon className={styles.icon} />
          </span>
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copyState === 'copied' ? 'コードをコピーしました' : ''}
        {copyState === 'failed' ? 'コードのコピーに失敗しました' : ''}
      </span>
    </div>
  );
}
