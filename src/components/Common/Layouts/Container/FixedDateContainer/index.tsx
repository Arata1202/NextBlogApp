import AdAlert from '@/components/Common/AdAlert';
import SingleDate from '@/components/Common/SingleDate';

type Props = {
  date: Date;
  updatedDate?: Date;
};

export default function FixedDateContainer({ date, updatedDate }: Props) {
  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex justify-end">
        <SingleDate date={date.toISOString()} />
        {updatedDate && <SingleDate date={updatedDate.toISOString()} updatedAt={true} />}
      </div>
      <AdAlert />
    </div>
  );
}
