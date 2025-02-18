import { useTheme } from 'next-themes';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import SearchField from '@/components/Elements/SearchField';

export default function Search() {
  const { theme } = useTheme();

  return (
    <>
      <div className={`pt-8 px-4 border py-5 ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}>
        <div className={`text-2xl text-center font-semibold mb-5 flex justify-center`}>
          <MagnifyingGlassIcon className="h-8 w-8 mr-2" />
          キーワードで探す
        </div>
        <SearchField />
      </div>
    </>
  );
}
