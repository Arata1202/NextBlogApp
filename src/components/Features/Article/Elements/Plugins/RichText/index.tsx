import { useTheme } from 'next-themes';
import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';
import { formatRichText } from '@/utils/formatRichText';

type Props = {
  block: ContentBlock;
};

export default function RichText({ block }: Props) {
  const { theme } = useTheme();

  return (
    <>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: formatRichText(block.rich_text!, theme).replace(/<img/g, '<img loading="lazy"'),
        }}
      />
    </>
  );
}
