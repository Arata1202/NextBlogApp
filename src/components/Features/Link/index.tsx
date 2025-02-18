'use client';

import { Article } from '@/libs/microcms';
import { useTheme } from 'next-themes';
import styles from './index.module.css';
import Display from '../../Adsense/Display';
import PublishedDate from '@/components/Elements/Date';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Elements/Share';
import AdAlert from '../../Articles/Elements/AdAlert';

type Props = {
  articles: Article[];
};

export default function Link({ articles }: Props) {
  const { theme } = useTheme();

  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          <div className="lg:col-span-2">
            <div className="space-y-5 lg:space-y-8">
              <div className="flex justify-end gap-x-5">
                <PublishedDate date={formattedDate} />
              </div>
              <AdAlert />
            </div>
            <div className={`${styles.content} mt-10 mb-5`}>
              <h2
                className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
              >
                リンクについて
              </h2>
              <p>
                リアル大学生（以下、「本サービス」と言います。）は完全リンクフリーです。リンクを行う場合の本サービスへの許可や連絡は不要です。
                <br />
                <br />
                ただし、インラインフレームの使用や画像の直リンクはご遠慮ください。
              </p>
            </div>
            <div className="FirstAd">
              <Display slot="1831092739" />
            </div>
            <Share />
          </div>
          <Sidebar allArticles={articles} mobile={false} />
        </div>
      </div>
    </>
  );
}
