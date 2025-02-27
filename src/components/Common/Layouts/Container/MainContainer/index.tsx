import styles from './index.module.css';

type Props = {
  children: React.ReactNode;
  article?: boolean;
};

export default function MainContainer({ children, article = false }: Props) {
  return (
    <div className={`${article && styles.container} max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2`}>
      <div className="grid lg:grid-cols-3 gap-y-5 lg:gap-y-0 lg:gap-x-6">{children}</div>
    </div>
  );
}
