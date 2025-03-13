import Markdown from '@/components/Common/Markdown';
import { COPYRIGHT_CONTENT } from '@/contents/copyright';

export default function CopyrightFeature() {
  return (
    <>
      <Markdown content={COPYRIGHT_CONTENT} />
    </>
  );
}
