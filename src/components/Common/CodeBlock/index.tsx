'use client';

import { isValidElement, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import CodeBlockToolbar from './Toolbar';
import styles from './index.module.css';

/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code regions need keyboard focus. */

type Props = ComponentPropsWithoutRef<'pre'> & {
  filename?: string;
};

export const getReactNodeText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getReactNodeText).join('');
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getReactNodeText(node.props.children);
  }

  return '';
};

export default function CodeBlock({ children, className, filename, ...props }: Props) {
  const [wrapped, setWrapped] = useState(false);
  const wrapClassName = wrapped ? styles.wrapped : styles.unwrapped;

  return (
    <div className={styles.codeBlockFrame}>
      <CodeBlockToolbar
        filename={filename}
        getCodeText={() => getReactNodeText(children)}
        wrapped={wrapped}
        onWrappedChange={setWrapped}
      />
      <pre
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
