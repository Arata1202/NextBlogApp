import Markdown from '@/components/Common/Markdown';
import { PROFILE_CONTENT } from '@/contents/profile';

export default function ProfileFeature() {
  return (
    <>
      <Markdown content={PROFILE_CONTENT} profile={true} />
    </>
  );
}
