import Markdown from '@/components/Common/Markdown';
import { PRIVACY_CONTENT } from '@/contents/privacy';

export default function PrivacyFeature() {
  return (
    <>
      <Markdown content={PRIVACY_CONTENT} />
    </>
  );
}
