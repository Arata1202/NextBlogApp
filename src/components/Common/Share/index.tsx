import { ARTICLE_SHARE_ID, WEB_HEADER_SCROLL_MARGIN } from '@/constants/navigation';
import { Article } from '@/types/microcms';
import ShareSection from './Elements/ShareSection';
import FollowSection from './Elements/FollowSection';
import SupportSection from './Elements/SupportSection';

type Props = {
  data?: Article;
};

export default function Share({ data }: Props) {
  return (
    <>
      <div
        id={data ? ARTICLE_SHARE_ID : undefined}
        tabIndex={data ? -1 : undefined}
        className="mt-5"
        style={{ scrollMarginTop: WEB_HEADER_SCROLL_MARGIN }}
        data-web-share
      >
        <ShareSection data={data} />
        <FollowSection />
        <SupportSection data={data} />
      </div>
    </>
  );
}
