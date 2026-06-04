'use client';

import { isValidElement, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import CodeBlockToolbar from './Toolbar';
import styles from './index.module.css';

type Props = ComponentPropsWithoutRef<'pre'>;

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

export default function CodeBlock({ children, className, ...props }: Props) {
  const [wrapped, setWrapped] = useState(false);
  const wrapClassName = wrapped ? styles.wrapped : styles.unwrapped;

  return (
    <div className={styles.codeBlockFrame}>
      <CodeBlockToolbar
        getCodeText={() => getReactNodeText(children)}
        wrapped={wrapped}
        onWrappedChange={setWrapped}
      />
      <pre className={`${styles.codeBlock} ${wrapClassName} ${className ?? ''}`.trim()} {...props}>
        {children}
      </pre>
    </div>
  );
}

export { CodeBlockToolbar, styles as codeBlockStyles };
