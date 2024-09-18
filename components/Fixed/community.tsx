'use client';

import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { InformationCircleIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import FixedSidebar from '@/components/FixedSidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import TableOfContents from '../TableOfContent';
import Display from '../Adsense/display';

const CommunityPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  // const headings = [
  //   { id: 'introduction', title: '個人情報取り扱いに関する基本方針', level: 2 },
  //   { id: 'definition', title: '個人情報の定義', level: 2 },
  //   { id: 'acquisition', title: '個人情報の取得方法', level: 2 },
  //   { id: 'cookie', title: 'クッキー（Cookie）', level: 3 },
  //   { id: 'analytics', title: 'アクセス解析ツール', level: 3 },
  //   { id: 'comment', title: 'コメントについて', level: 3 },
  //   { id: 'purpose', title: '個人情報の利用目的', level: 2 },
  //   { id: 'advertisement', title: '本サービスが利用している広告サービス', level: 2 },
  //   { id: 'amazon', title: 'Amazonアソシエイトプログラム', level: 3 },
  //   { id: 'google', title: 'Googleアドセンス', level: 3 },
  //   { id: 'management', title: '個人情報の管理方法', level: 2 },
  //   { id: 'third-party', title: '個人情報の第三者提供', level: 2 },
  //   { id: 'disclosure', title: '個人情報の開示、訂正などの手続きについて', level: 2 },
  //   { id: 'disclaimer', title: '免責事項', level: 2 },
  //   { id: 'copyright', title: '著作権について', level: 2 },
  //   { id: 'link', title: 'リンクについて', level: 2 },
  //   { id: 'contact', title: '個人情報の取扱いに関する相談や苦情の連絡先', level: 2 },
  // ];

  //出稿日
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
                  エンジニア初学者のためのゆるく楽しく学べる場所である、
                  <span className="underline_red">コミュニティ</span>をご紹介します！
                  <br />
                  メンバー同士の交流を通じて、楽しく学べる環境を用意しております！
                </p>

                <h2>参加資格</h2>
                <p>参加資格は以下の通りです。</p>
                <ul>
                  <li>エンジニアの方</li>
                  <li>エンジニアに興味がある方</li>
                </ul>
                <p>
                  年齢や職業に関係なく、学生以外の方もご参加いただけます。
                  <br />
                  実際に学生以外の参加者もおります。
                </p>

                <h2>活動内容</h2>
                <p>
                  次に活動内容について紹介します
                  <br />
                  主な内容としては以下の通りです。
                </p>
                <ul>
                  <li>アプリ紹介</li>
                  <li>質問・ヘルプ</li>
                  <li>雑談</li>
                  <li>作業記録</li>
                </ul>

                <h3>アプリ紹介</h3>
                <p>
                  このチャンネルでは、開発したアプリを紹介し、フィードバックを得ることができます。
                  <br />
                  <br />
                  サービスは開発がゴールではなく、実際に使ってもらうことでその価値が高まっていきます。
                  コミュニティを活用して実用性を磨きましょう。
                </p>

                <h3>質問・ヘルプ</h3>
                <p>
                  このチャンネルでは、開発やエンジニアに関する疑問を気軽に質問できます。
                  <br />
                  <br />
                  助け合いの場としても活用でき、お互いに学び合うことができます。
                </p>

                <h3>雑談</h3>
                <p>
                  このチャンネルでは、気軽な雑談ができます。
                  <br />
                  <br />
                  エンジニアに関する話題に限らず、日常のエピソードを通じてメンバー同士の仲を深めましょう。
                </p>

                <h3>作業記録</h3>
                <p>
                  日々の作業内容を記録・共有するチャンネルです。
                  <br />
                  <br />
                  お互いに進捗を報告し合うことで、モチベーションの向上にもつながります。
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
