import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
};

export default function FixedContentContainer({ children }: Props) {
  return <div className={`${styles.content} mt-10 mb-5`}>{children}</div>;
}
