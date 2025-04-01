import type { MicroCMSImage, MicroCMSDate, MicroCMSContentId } from 'microcms-js-sdk';

export type Blog = {
  title: string;
  description: string;
  thumbnail: MicroCMSImage;
  categories: Category[];
  tags?: Tag[];
  introduction_blocks: IntroductionBlock[];
  content_blocks: ContentBlock[];
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
