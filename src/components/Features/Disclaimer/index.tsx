'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import Display from '../../Adsense/Display';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import PublishedDate from '@/components/Elements/Date';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Elements/Share';
import AdAlert from '../../Articles/Elements/AdAlert';

type Props = {
  articles: Article[];
};

export default function Disclaimer({ articles }: Props) {
  const { theme } = useTheme();

  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <MainContainer>
        <ContentContainer>
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
              免責事項
            </h2>
            <p>
              リアル大学生（以下、「本サービス」と言います。）からのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。
              <br />
              <br />
              また本サービスのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。
              <br />
              <br />
              本サービスに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
            </p>
          </div>
          <div className="FirstAd">
            <Display slot="1831092739" />
          </div>
          <Share />
        </ContentContainer>
        <Sidebar allArticles={articles} mobile={false} />
      </MainContainer>
    </>
  );
}
