import { useTheme } from 'next-themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchField from '../../../Elements/SearchField';
import styles from './index.module.css';

export default function Search() {
  const { theme } = useTheme();
  return (
    <div className={`pt-8 px-4 border py-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
      <h1
        className={`${styles.profile} text-2xl text-center font-semibold mb-5 flex justify-center`}
      >
        <MagnifyingGlassIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        キーワードで探す
      </h1>
      <SearchField />
    </div>
  );
}
