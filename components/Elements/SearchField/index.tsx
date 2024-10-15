import React, { useState, FormEvent, useRef } from 'react';
import styles from './index.module.css';

interface SearchFieldProps {
  defaultQuery?: string;
}

export default function SearchField({ defaultQuery = '' }: SearchFieldProps) {
  const [query, setQuery] = useState<string>(defaultQuery);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(
        'https://7wr3dauqaae63rgh56bjei6eea0pfcpj.lambda-url.ap-northeast-2.on.aws/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        },
      );

      if (res.ok) {
        console.log('Query saved successfully');
        if (formRef.current) {
          formRef.current.submit();
        }
      } else {
        console.error('Failed to save query');
      }
    } catch (error) {
      console.error('Error saving query:', error);
    }
  };

  return (
    <form ref={formRef} action="/search" method="GET" onSubmit={handleSubmit}>
      <input
        type="search"
        name="q"
        className={`${styles.search} hover:border-blue-500`}
        placeholder="検索"
        defaultValue={query}
        style={{ width: '100%', borderRadius: '0' }}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" style={{ display: 'none' }}>
        Search
      </button>
    </form>
  );
}
