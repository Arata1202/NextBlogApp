import Markdown from '@/components/Common/Markdown';
import { LINK_CONTENT } from '@/contents/link';

export default function LinkFeature() {
  return (
    <>
      <Markdown content={LINK_CONTENT} />
    </>
  );
}
