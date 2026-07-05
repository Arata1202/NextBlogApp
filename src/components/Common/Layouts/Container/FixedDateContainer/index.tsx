import AdAlert from '@/components/Common/AdAlert';
import DoubleDate from '@/components/Common/DoubleDate';

type Props = {
  date: Date;
  updatedDate?: Date;
};

export default function FixedDateContainer({ date, updatedDate }: Props) {
  return (
    <div className="space-y-5 lg:space-y-8">
      <DoubleDate
        article={{
          publishedAt: date.toISOString(),
          updatedAt: updatedDate?.toISOString(),
        }}
        articleMode
      />
      <AdAlert />
    </div>
  );
}
