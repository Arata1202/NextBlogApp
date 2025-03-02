import { ContentBlock } from '@/types/microcms';
import styles from './index.module.css';

type Props = {
  block: ContentBlock;
};

export default function CustomHtml({ block }: Props) {
  return (
    <>
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: block.custom_html! }} />
    </>
  );
}
