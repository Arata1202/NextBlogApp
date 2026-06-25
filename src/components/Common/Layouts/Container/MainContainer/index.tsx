import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  article?: boolean;
};

export default function MainContainer({ children, article = false }: Props) {
  return (
    <div
      className={`${article && styles.container} max-w-340 sm:px-6 lg:px-8 mx-auto pb-2`}
      data-article-main={article ? 'true' : undefined}
    >
      <div
        className="grid min-w-0 lg:grid-cols-3 gap-y-5 lg:gap-y-0 lg:gap-x-6"
        data-app-content-grid
      >
        {children}
      </div>
    </div>
  );
}
