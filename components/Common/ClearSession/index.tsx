'use client';
import { useEffect } from 'react';

export default async function ClearSession() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);
  return <div></div>;
}
