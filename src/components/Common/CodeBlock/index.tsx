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
    <pre className={`${styles.codeBlock} ${wrapClassName} ${className ?? ''}`.trim()} {...props}>
      <CodeBlockToolbar
        getCodeText={() => getReactNodeText(children)}
        wrapped={wrapped}
        onWrappedChange={setWrapped}
      />
      {children}
    </pre>
  );
}

export { CodeBlockToolbar, styles as codeBlockStyles };
