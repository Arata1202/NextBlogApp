import AdAlert from '@/components/Common/AdAlert';
import SingleDate from '@/components/Common/SingleDate';

type Props = {
  date: Date;
};

export default function FixedDateContainer({ date }: Props) {
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="space-y-5 lg:space-y-8">
      <div className="flex justify-end gap-x-5">
        <SingleDate date={formattedDate} />
      </div>
      <AdAlert />
    </div>
  );
}
