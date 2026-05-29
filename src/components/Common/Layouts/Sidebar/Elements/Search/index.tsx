'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useTheme } from 'next-themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Search() {
  const { theme } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search');
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
            id="sidebar-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="キーワードを入力"
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
      </form>
    </div>
  );
}
