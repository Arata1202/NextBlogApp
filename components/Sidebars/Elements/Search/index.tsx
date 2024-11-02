import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchField from '../../../Elements/SearchField';
import styles from './index.module.css';

interface Props {
  isDarkMode?: boolean;
}

export default function Search({ isDarkMode }: Props) {
  return (
    <div
      className={`pt-8 px-4 border py-5 ${isDarkMode ? 'DarkTheme border-gray-500 placeholder:text-gray-500' : 'lightTheme border-gray-300 placeholder:text-gray-300'}`}
    >
      <h1
        className={`${styles.profile} text-2xl text-center font-semibold mb-5 flex justify-center`}
      >
        <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        キーワードで探す
      </h1>
      <SearchField isDarkMode={isDarkMode} />
    </div>
  );
}
