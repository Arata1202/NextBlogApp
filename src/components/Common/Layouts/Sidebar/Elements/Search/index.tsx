'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import {
  fieldControlClassName,
  outlinedControlClassName,
} from '@/components/Common/controlClassNames';

export default function Search() {
  const { theme } = useTheme();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const errorMessageId = 'sidebar-search-error';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.metaKey || event.key.toLowerCase() !== 'k') {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setErrorMessage('※ キーワードを入力してください');
      return;
    }

    setErrorMessage('');
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  return (
    <div className={`px-4 border py-5 mb-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <div className="text-2xl text-center font-semibold flex justify-center">
        <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        検索
      </div>

      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor="sidebar-search" className="sr-only">
          検索
        </label>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            id="sidebar-search"
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value.trim()) {
                setErrorMessage('');
              }
            }}
            placeholder="キーワードを入力"
            aria-invalid={Boolean(errorMessage)}
            aria-describedby={errorMessage ? errorMessageId : undefined}
            aria-keyshortcuts="Meta+K"
            className={`${fieldControlClassName} h-10 min-w-0 flex-1 px-3 text-base sm:text-sm ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          />
          <button
            type="submit"
            className={`${outlinedControlClassName} inline-flex h-10 w-10 shrink-0 items-center justify-center ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            aria-label="検索"
          >
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {errorMessage && (
          <p id={errorMessageId} className="text-red-700" role="alert">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
