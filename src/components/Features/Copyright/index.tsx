'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import AdUnit from '@/components/Common/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import SingleDate from '@/components/Common/SingleDate';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import AdAlert from '../../Common/AdAlert';

type Props = {
  articles: Article[];
};

export default function CopyrightFeature({ articles }: Props) {
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
              <SingleDate date={formattedDate} />
            </div>
            <AdAlert />
          </div>
          <div className={`${styles.content} mt-10 mb-5`}>
            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              著作権について
            </h2>
            <p>
              リアル大学生（以下、「本サービス」と言います。）のコンテンツ（写真や画像、文章など）の著作権につきましては、
              原則として本サービスに帰属しており、無断転載することを禁止します。
              <br />
              <br />
              本サービスのコンテンツを利用したい場合は、別途お問い合わせください。
              <br />
              <br />
              本サービスは著作権や肖像権の侵害を目的としたものではありません。著作権や肖像権に関して問題がございましたら、
              <a href="/contact">お問い合わせ</a>
              よりご連絡ください。迅速に対応いたします。
            </p>
          </div>
          <AdUnit slot="1831092739" />
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} mobile={false} />
      </MainContainer>
    </>
  );
}
