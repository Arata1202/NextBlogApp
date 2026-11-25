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
      <div id={data ? 'article-share' : undefined} className="mt-5 scroll-mt-20" data-web-share>
        <ShareSection data={data} />
        <FollowSection />
        <SupportSection data={data} />
      </div>
    </>
  );
}
