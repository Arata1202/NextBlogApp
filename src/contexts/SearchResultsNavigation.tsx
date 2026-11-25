'use client';

import { createContext, useLayoutEffect, useRef, type ReactNode } from 'react';
import { SEARCH_RESULTS_HEADING_ID } from '@/constants/navigation';

export const SearchResultsFocusContext = createContext<((query: string) => void) | null>(null);

function focusResults() {
  const heading = document.getElementById(SEARCH_RESULTS_HEADING_ID);
  heading?.focus({ preventScroll: true });
  heading?.scrollIntoView({ block: 'start' });
}

export function SearchResultsNavigation({
  query,
  children,
}: {
  query: string;
  children: ReactNode;
}) {
  const requested = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (requested.current === query) focusResults();
    requested.current = null;
  }, [query]);

  function requestFocus(nextQuery: string) {
    requested.current = nextQuery === query ? null : nextQuery;
    if (nextQuery === query) focusResults();
  }

  return (
    <SearchResultsFocusContext.Provider value={requestFocus}>
      {children}
    </SearchResultsFocusContext.Provider>
  );
}
