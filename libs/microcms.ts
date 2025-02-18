import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

export type Blog = {
  title: string;
  description: string;
  thumbnail: MicroCMSImage;
  categories: Category[];
  tags?: Tag[];
  introduction_blocks: IntroductionBlock[];
  content_blocks: ContentBlock[];
  related_articles: RelatedArticle[];
};

export type Article = Blog & MicroCMSContentId & MicroCMSDate;

export type Category = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

export type Tag = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

export type IntroductionBlock = {
  rich_text?: string;
  custom_html?: string;
  article_link?: string;
  bubble_image?: MicroCMSImage;
  bubble_name?: string;
  bubble_text?: string;
  bubble_isRight?: boolean;
  box_merit?: string;
  box_demerit?: string;
  box_point?: string;
  box_common?: string;
};

export type ContentBlock = {
  google_adsense?: string;
  rich_text?: string;
  custom_html?: string;
  article_link?: string;
  bubble_image?: MicroCMSImage;
  bubble_name?: string;
  bubble_text?: string;
  bubble_isRight?: boolean;
  box_merit?: string;
  box_demerit?: string;
  box_point?: string;
  box_common?: string;
};

export type RelatedArticle = {
  article_link?: string;
};

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export const getAllLists = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getAllContents<Blog>({
      endpoint: 'blog',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getAllCategoryLists = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getAllContents<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getAllTagLists = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getAllContents<Tag>({
      endpoint: 'tags',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Blog>({
      endpoint: 'blog',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Blog>({
      endpoint: 'blog',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getCategory = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Category>({
      endpoint: 'categories',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

export const getTagList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Tag>({
      endpoint: 'tags',
      queries,
    })
    .catch(notFound);

  return listData;
};

export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Tag>({
      endpoint: 'tags',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};
