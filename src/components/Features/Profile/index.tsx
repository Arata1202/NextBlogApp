'use client';

import { useTheme } from 'next-themes';
import { Article } from '@/libs/microcms';
import styles from './index.module.css';
import Display from '../../Common/ThirdParties/GoogleAdSense/Elements/AdUnit';
import MainContainer from '@/components/Common/Layouts/Container/MainContainer';
import ContentContainer from '@/components/Common/Layouts/Container/ContentContainer';
import SingleDate from '@/components/Common/SingleDate';
import Sidebar from '@/components/Common/Layouts/Sidebar';
import Share from '../../Common/Share';
import AdAlert from '../../Common/AdAlert';

type Props = {
  articles: Article[];
};

export default function ProfileFeature({ articles }: Props) {
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
          <div className="flex justify-center">
            <img
              src="/images/blog/face.webp"
              alt="筆者のイメージ"
              width={300}
              height={300}
              className="mt-10"
            />
          </div>
          <div className={`${styles.content} mt-10 mb-5`}>
            <p>
              初めまして、現役大学生のあらたと申します。
              <br />
              <br />
              「プログラミングを勉強する大学生」をテーマにブログを始めました。
              <br />
              <br />
              大学では経営やマーケティングを学びつつ、独学でプログラミングを学び、エンジニアの長期インターンシップに参加しています。現在も継続してスキルアップを図っています
              <br />
              <br />
              同じように未経験からエンジニアを目指している方々も多いと思います。このブログでは、現役大学生の私が独学で習得したプログラミングの知識や大学生活の情報を共有していきます。
              <br />
              <br />
              どうぞよろしくお願いいたします。
            </p>

            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              ブログ始めたきっかけ
            </h2>
            <p>
              まだまだ大学3年生ですが、様々な経験をしてきました。社会人になる一歩手前ということもあり、挑戦できることの幅も増え、運転免許を取得したり、アルバイトを始めたり、将来の夢に向けて勉強したりなど、やらなければならない事がたくさん増えました。
              <br />
              <br />
              そんな中、自分なりに解決法を探しながら生活してきました。それらの経験を無駄にせず、同じ気持ちを抱く大学生の方々に共有したいと考え、ブログを始めました。
            </p>

            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              プロフィール
            </h2>
            <p>筆者の活動や趣味についてご紹介します。</p>

            <h3
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              筆者について
            </h3>
            <ul>
              <li>年齢｜21歳</li>
              <li>在住｜千葉県</li>
              <li>大学生｜東洋大学 経営学部 マーケティング学科</li>
              <li>インターン｜Webエンジニア（長期）</li>
              <li>趣味｜旅行、ドライブ、ゲーム、プログラミングなどなど</li>
            </ul>

            <h4
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              大学
            </h4>
            <p>
              大学では経営学部のマーケティング学科に所属し、ゼミでは消費者行動の研究や企業の成長戦略について議論しています。
            </p>

            <h4
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              インターンシップ
            </h4>
            <p>
              都内の企業でWebメディアやCMSの開発を行っています。また、外部企業からの案件も手掛けています。
              <br />
              <br />
              使用している技術は、Vue.js、Laravel、Next.jsなどです。
            </p>

            <h4
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              旅行
            </h4>
            <p>
              とにかく旅行が大好きです。飛行機や電車、車などあらゆる手段を使って旅行しています。特に温泉地に行くのが好きなので、東北旅行なども好きだったりします。
              <br />
              <br />
              青春18切符やJALのスカイメイトを利用したりなど、自称ではありますが、普通よりは旅行知識があるのではないかと思っています（笑）。
              <br />
              <br />
              Instagramでは、主に旅行について紹介しています。興味のある方はぜひご覧ください。
              <br />
              <br />
              <a href="https://www.instagram.com/ao_realstudent/" target="brank">
                Instagram
              </a>
            </p>

            <h4
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              ゲーム
            </h4>
            <p>
              最近はあまりしていませんが、ゲームも好きです。SwitchとゲーミングPCを持っており、休日にたまに遊んでいます。
              <br />
              <br />
              FPSゲームが特に好きで、APEXやスプラトゥーンをよくプレイしています。
            </p>

            <h4
              className={`${theme === 'dark' ? 'border-gray-500 text-white' : 'border-gray-300 text-gray-700'}`}
            >
              プログラミング
            </h4>
            <p>
              去年始めたプログラミングにすっかりハマり、趣味の一つになりました。このブログも自分で作成しました。
            </p>

            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              技術スタック
            </h2>
            <p>筆者は以下の技術をよく使用しています。</p>
            <ul>
              <li>フロントエンド｜React, Next.js, Vue.js, TypeScript, TailwindCSS</li>
              <li>バックエンド｜PHP, Laravel</li>
              <li>データベース｜MySQL</li>
              <li>ホスティング｜Vercel, AWS</li>
              <li>ツール｜GitHub, Docker</li>
            </ul>
            <p>
              インターンではVue.jsとLaravel、個人開発ではReactやNext.js, PHPの使用頻度が高いです。
            </p>

            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              当ブログ（リアル大学生）の使用技術
            </h2>
            <p>当ブログ（リアル大学生）は以下の構成で、運営しています。</p>
            <ul>
              <li>フロントエンド｜Next.js, TypeScript, TailwindCSS</li>
              <li>ツール｜MicroCMS, GitHub</li>
              <li>ホスティング｜Vercel</li>
              <li>バックエンド｜AWS Lambda</li>
            </ul>

            <h2
              className={`${theme === 'dark' ? 'bg-gray-500 text-white' : 'bg-gray-300 text-gray-700'}`}
            >
              お問い合わせ
            </h2>
            <p>
              お問い合わせの際は、下記の窓口からお願いいたします。
              <br />
              <br />
              サイト運営者：あらた
              <br />
              連絡先：
              <a href="/contact" className="text-blue-500 hover:text-blue-700">
                お問い合わせ
              </a>
            </p>
          </div>
          <div className="FirstAd">
            <Display slot="1831092739" />
          </div>
          <Share />
        </ContentContainer>
        <Sidebar recentArticles={articles} mobile={false} />
      </MainContainer>
    </>
  );
}
