'use client';

import { useCallback, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './index.module.css';

export default function SearchField() {
  const [composing, setComposition] = useState(false);
  const startComposition = () => setComposition(true);
  const endComposition = () => setComposition(false);
  const _onEnter: React.KeyboardEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      if (e.code === 'Enter' && !composing) {
        location.href = `/search?q=${inputRef.current?.value}`;
      }
    },
    [composing],
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const defaultQuery = (searchParams?.get('q') ?? '') as string;
  return (
    <input
      type="search"
      name="q"
      ref={inputRef}
      className={`${styles.search} hover:border-blue-500`}
      placeholder="Search..."
      onKeyDown={_onEnter}
      onCompositionStart={startComposition}
      onCompositionEnd={endComposition}
      defaultValue={defaultQuery}
      style={{ width: '100%', borderRadius: '0' }}
    />
  );
}
