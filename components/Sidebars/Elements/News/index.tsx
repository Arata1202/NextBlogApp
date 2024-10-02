import { NewspaperIcon } from '@heroicons/react/24/solid';
import styles from '../../FixedSidebar/index.module.css';
import { news } from '@/section/news';

export default function News() {
  return (
    <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
      <h1 className={`${styles.profile} text-2xl text-center font-semibold flex justify-center`}>
        <NewspaperIcon className="h-8 w-8 mr-2" aria-hidden="true" />
        お知らせ
      </h1>

      <div className="">
        <div className="mt-5" style={{ maxHeight: '240px', overflowY: 'auto' }}>
          <table className="min-w-full">
            <colgroup>
              <col className="w-full sm:w-1/2" />
            </colgroup>
            <tbody>
              {news.map((news, index) => (
                <tr key={news.id} className="border-b border-gray-200">
                  <td
                    className={`max-w-0 ${
                      index === 0 ? 'pt-0 pb-5' : 'py-5'
                    } pl-4 pr-3 text-sm sm:pl-0`}
                  >
                    <div style={{ fontSize: '18px' }} className="text-gray-900">
                      {news.name}
                    </div>
                    <div className="mt-1 truncate">
                      <a
                        className="text-blue-500 hover:text-blue-700"
                        target="blank"
                        href={news.url}
                      >
                        {news.meta}
                      </a>
                    </div>
                    <div className="mt-1 truncate text-gray-500">{news.description}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
