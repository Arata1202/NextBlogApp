import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { MicroCMSQueries } from 'microcms-js-sdk';
import { getCategory, getDetail, getTag } from '@/libs/microcms';

type ErrorWithStatus = {
  status?: number;
  response?: {
    status?: number;
  };
};

const isMicroCmsNotFoundError = (error: unknown) => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const errorWithStatus = error as ErrorWithStatus;

  return errorWithStatus.status === 404 || errorWithStatus.response?.status === 404;
};

const resolveOrNotFound = async <T>(resolve: () => Promise<T>) => {
  try {
    return await resolve();
  } catch (error) {
    if (isMicroCmsNotFoundError(error)) {
      notFound();
    }

    throw error;
  }
};

export const getArticleDetailForPage = cache((contentId: string, queries?: MicroCMSQueries) => {
  return resolveOrNotFound(() =>
    queries === undefined ? getDetail(contentId) : getDetail(contentId, queries),
  );
});

export const getCategoryForPage = cache((contentId: string, queries?: MicroCMSQueries) => {
  return resolveOrNotFound(() =>
    queries === undefined ? getCategory(contentId) : getCategory(contentId, queries),
  );
});

export const getTagForPage = cache((contentId: string, queries?: MicroCMSQueries) => {
  return resolveOrNotFound(() =>
    queries === undefined ? getTag(contentId) : getTag(contentId, queries),
  );
});
