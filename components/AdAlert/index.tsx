import { BellIcon } from '@heroicons/react/24/solid';

export default function AdAlert() {
  return (
    <div className="AdAlert includeBanner flex justify-center text-center p-3">
      <BellIcon className="h-7 w-7 mr-2" aria-hidden="true" />
      記事内に広告が含まれています。
    </div>
  );
}
