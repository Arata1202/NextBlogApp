import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import styles from './index.module.css';

export default function Banner() {
  return (
    <>
      <div className="flex justify-center items-center gap-x-6 bg-gray-500 py-1">
        <div className={`${styles.text} text-white`}>
          <a
            href="http://www.rentracks.jp/adx/r.html?idx=0.61256.344874.638.7876&dna=102958"
            target="_blank"
            rel="nofollow noopener"
            className="flex transition-transform duration-200 hover:scale-105"
          >
            <svg viewBox="0 0 2 2" className="mx-2 inline size-0.5 fill-current"></svg>
            筆者も使ったエンジニア就活サービス【レバテック】
            <ArrowTopRightOnSquareIcon className="h-5 w-5 ml-1" />
          </a>
        </div>
      </div>
    </>
  );
}
