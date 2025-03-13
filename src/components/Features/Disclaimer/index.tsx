import Markdown from '@/components/Common/Markdown';
import { DISCLAIMER_CONTENT } from '@/contents/disclaimer';

export default function DisclaimerFeature() {
  return (
    <>
      <Markdown content={DISCLAIMER_CONTENT} />
    </>
  );
}
