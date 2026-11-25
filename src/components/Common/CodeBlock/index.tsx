'use client';

import { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import CodeBlockToolbar from './Toolbar';
import styles from './index.module.css';

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code regions need keyboard focus. */

type Props = ComponentPropsWithoutRef<'pre'> & {
  filename?: string;
};

export default function CodeBlock({ children, className, filename, ...props }: Props) {
  const codeRef = useRef<HTMLPreElement>(null);
  const [wrapped, setWrapped] = useState(false);
  const wrapClassName = wrapped ? styles.wrapped : styles.unwrapped;

  return (
    <div className={styles.codeBlockFrame}>
      <CodeBlockToolbar
        filename={filename}
        getCodeText={() => codeRef.current?.textContent ?? ''}
        wrapped={wrapped}
        onWrappedChange={setWrapped}
      />
      <pre
        ref={codeRef}
        aria-label={filename ? `コードブロック: ${filename}` : 'コードブロック'}
        role="region"
        tabIndex={0}
        className={`${styles.codeBlock} ${wrapClassName} ${className ?? ''}`.trim()}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export { CodeBlockToolbar, styles as codeBlockStyles };
