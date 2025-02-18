'use client';
import { useTheme } from 'next-themes';
import styles from './index.module.css';

export default function SearchField({ defaultQuery = '' }) {
  const { theme } = useTheme();
  return (
    <form action="/search" method="GET">
      <input
        type="search"
        name="q"
        className={`${styles.search} border ${theme === 'dark' ? 'DarkTheme placeholder:text-gray-500' : 'LightTheme placeholder:text-gray-500'} focus:border-2 focus:border-blue-500 focus:outline-none`}
        placeholder="検索"
        defaultValue={defaultQuery}
        style={{ width: '100%', borderRadius: '0' }}
      />
      <button type="submit" style={{ display: 'none' }}>
        Search
      </button>
    </form>
  );
}
