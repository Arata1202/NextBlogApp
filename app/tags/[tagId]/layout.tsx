import { getTag } from '@/libs/microcms';
import TagListItem from '@/components/TagListItem';
import styles from './layout.module.css';
import { FolderOpenIcon } from '@heroicons/react/24/solid';

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
      <h1 className="categoryTitle text-3xl font-bold pt-5 max-w-[85rem] sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center pb-2 pt-2">
          <FolderOpenIcon className="h-8 w-8 mr-2" aria-hidden="true" />
          <div>{tag.name}</div>
        </div>
      </h1>
      <div>{children}</div>
    </div>
  );
}
