import React from 'react';
import styles from './index.module.css';

export default function SearchField({ defaultQuery = '' }) {
  return (
    <form action="/search" method="GET">
      <input
        type="search"
        name="q"
        className={`${styles.search} hover:border-blue-500`}
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
