'use client';

import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import FixedSidebar from '@/components/FixedSidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import Display from '../Adsense/display';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

const CommunityPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  const dummyDate = new Date(2024, 8, 17);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <>
      <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
        <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="FirstAd">
              <Display slot="7197259627" />
            </div>
            <div className="">
              <div className="space-y-5 lg:space-y-8">
                <div className="includeBanner flex justify-end gap-x-5">
                  {/* <TagList tags={data.tags} /> */}
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
              </div>
              {/* <TableOfContents headings={headings} /> */}
              <div className={`${styles.content} mt-10 mb-5`}>
                <h2>コミュニティについて</h2>
                <p>
                  主にエンジニア初学者が集まり、楽しく交流や勉強を行っている「リアル大学生コミュニティ」について紹介します！
                  <br />
                  <br />
                  <span className="underline_red">
                    ※学生限定のコミュニティではありませんので、学生以外の参加者もいらっしゃいます！
                  </span>
                  <br />
                  <span className="underline_red">※参加・退会は自由です！</span>
                </p>

                <h2>活動内容</h2>
                <p>主な活動目的は以下の通りです！</p>
                <div className={`${styles.tab_common_box} flex items-center`}>
                  <InformationCircleIcon
                    className={`h-8 w-8 ${styles.tab_common_box_icon}`}
                    aria-hidden="true"
                  />
                  <ul>
                    <li>アプリ紹介</li>
                    <li>質問・ヘルプ</li>
                    <li>雑談</li>
                    <li>作業記録</li>
                  </ul>
                </div>

                <h3>アプリ紹介</h3>
                <p>
                  開発したアプリを紹介し、フィードバックを得ることができます。
                  <br />
                  <br />
                  サービスは開発がゴールではなく、どのように人に使ってもらうかを考えることなどが大切です。
                  フィードバックを受けることで、より良いサービスを開発することができます。
                  <br />
                  <br />
                  私自身もアドバイスしますし、コミュニティメンバーからも様々なアドバイスを得られます。
                </p>

                <h3>質問・ヘルプ</h3>
                <p>
                  このチャンネルでは、開発やエンジニアに関する疑問を気軽に質問できます。
                  <br />
                  <br />
                  開発者それぞれが持つ技術や知識は異なりますので、詳しい人に聞くことで疑問を解決できると思います。
                  <br />
                  ちなみに、私はWeb開発中心の技術についてお答えできるかもしれません。
                  <br />
                  <br />
                  助け合いの場として、ぜひ活用してください。
                </p>

                <h3>雑談</h3>
                <p>
                  このチャンネルでは、気軽な雑談ができます。
                  <br />
                  <br />
                  エンジニアに関する話題だけでなく、日常のエピソードを通じてメンバー同士の仲を深めています。
                </p>

                <h3>作業記録</h3>
                <p>
                  日々の作業内容を記録・共有するためのチャンネルです。
                  <br />
                  <br />
                  お互いに進捗を報告し合うことで、モチベーションの向上にもつながります。
                </p>

                <h2>参加資格</h2>
                <p>以下のような方をお待ちしています！</p>
                <div className={`${styles.tab_common_box} flex items-center`}>
                  <InformationCircleIcon
                    className={`h-8 w-8 ${styles.tab_common_box_icon}`}
                    aria-hidden="true"
                  />
                  <ul>
                    <li>エンジニアの方</li>
                    <li>エンジニアに興味がある方</li>
                  </ul>
                </div>
                <p>年齢や職業に関係なく、学生以外の方も参加できます。</p>

                <h2>参加方法</h2>
                <p>
                  お手数ですが、私の
                  <a target="blank" href="https://x.com/Aokumoblog">
                    X（旧 Twitter）
                  </a>
                  のDMにてご連絡ください。
                  <br />
                  「参加希望します」とお伝えいただければ大丈夫です！
                  <br />
                  <br />
                  それではお待ちしております！
                </p>
              </div>
            </div>
            <div className="FirstAd">
              <Display slot="1831092739" />
            </div>
            <Share />
          </div>
          <div className="mobile">
            <FixedSidebar articles={sidebarArticles.contents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
