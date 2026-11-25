import type { Metadata } from 'next';

export const DEFAULT_PREVIEW_IMAGE = '/images/thumbnail/7.webp';

export function getSiteUrl() {
  const value = process.env.NEXT_PUBLIC_BASE_URL;
  const url = value && URL.canParse(value) ? new URL(value) : null;
  if (
    !url ||
    !['https:', 'http:'].includes(url.protocol) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error('NEXT_PUBLIC_BASE_URL must be an absolute HTTP(S) site URL');
  }
  return url.href.replace(/\/+$/, '');
}

export function getSiteTitle() {
  const title = process.env.NEXT_PUBLIC_BASE_TITLE?.trim();
  if (!title) throw new Error('NEXT_PUBLIC_BASE_TITLE is required');
  return title;
}

export function staticPageMetadata(path: string, name: string, description: string): Metadata {
  const base = getSiteUrl();
  const url = base + path;
  const title = `${name}｜${getSiteTitle()}`;
  return {
    title,
    description,
    openGraph: { title, description, images: base + DEFAULT_PREVIEW_IMAGE, url },
    alternates: { canonical: url },
  };
}
