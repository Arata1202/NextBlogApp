import AdAlert from '@/components/Common/AdAlert';
import DoubleDate from '@/components/Common/DoubleDate';

type Props = {
  date: Date;
  updatedDate?: Date;
};

export default function FixedDateContainer({ date, updatedDate }: Props) {
  return (
    <>
      <DoubleDate
        article={{
          publishedAt: date.toJSON() ?? undefined,
          updatedAt: updatedDate?.toJSON() ?? undefined,
        }}
        articleMode
      />
      <AdAlert />
    </>
  );
}
