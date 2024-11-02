import React from 'react';
import styles from './index.module.css';

interface Props {
  defaultQuery?: string;
  isDarkMode?: boolean;
}

export default function SearchField({ defaultQuery = '', isDarkMode }: Props) {
  return (
    <form action="/search" method="GET">
      <input
        type="search"
        name="q"
        className={`${styles.search} hover:border-blue-500 ${isDarkMode ? 'DarkTheme border border-gray-500 text-white' : 'lightTheme  border border-gray-300'}`}
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
