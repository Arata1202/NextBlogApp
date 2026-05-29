'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

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
        <MagnifyingGlassIcon className="h-8 w-8 mr-2" />
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
            className={`min-w-0 flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          />
          <button
            type="submit"
            className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border shadow-sm hover:border-blue-500 hover:text-blue-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
            aria-label="検索"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </button>
        </div>
        {errorMessage && (
          <p id={errorMessageId} className="text-red-500">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
