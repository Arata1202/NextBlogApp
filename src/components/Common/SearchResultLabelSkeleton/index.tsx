type Props = {
  variant: 'breadcrumb' | 'title';
};

const keywordSkeletonClassNames: Record<Props['variant'], string> = {
  breadcrumb: 'inline-block h-4 w-16 animate-pulse rounded bg-gray-300/70 align-middle',
  title: 'inline-block h-8 w-32 max-w-[40vw] animate-pulse rounded bg-gray-300/70 align-middle',
};

export default function SearchResultLabelSkeleton({ variant }: Props) {
  return (
    <>
      「
      <span className={keywordSkeletonClassNames[variant]} aria-hidden="true" />
      」の検索結果
    </>
  );
}
