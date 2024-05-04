import { getTag } from '@/libs/microcms';
import TagListItem from '@/components/TagListItem';
import styles from './layout.module.css';

type Props = {
  children: React.ReactNode;
  params: {
    tagId: string;
  };
};

export default async function TagsLayout({ children, params }: Props) {
  const { tagId } = params;
  const tag = await getTag(tagId);
  return (
    <div>
      {/* <div className="tagTitle"> */}
      {/* <h1 className="text-3xl font-bold lg:text-3xl ml-10 pl-5 pt-3">
        {tag.name}
        記事一覧
      </h1> */}
      <div>{children}</div>
    </div>
  );
}
