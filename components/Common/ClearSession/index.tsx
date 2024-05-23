'use client';
import { useEffect } from 'react';

export default function ClearSession() {
  useEffect(() => {
    sessionStorage.clear();
  }, []);

  return null;
}
