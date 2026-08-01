import styles from './index.module.css';

type Props = {
  sponsorName?: string;
  compact?: boolean;
};

export default function SponsoredDisclosure({ sponsorName, compact = false }: Props) {
  if (compact) {
    return <span className={styles.badge}>PR</span>;
  }

  return (
    <aside className={styles.disclosure} aria-label="広告に関する表示">
      <span className={styles.badge}>PR</span>
      <span>この記事は{sponsorName}から依頼を受け、広告として制作しています。</span>
    </aside>
  );
}
