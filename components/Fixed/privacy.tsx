'use client';

import styles from './index.module.css';
import PublishedDate from '@/components/Date';
import React from 'react';
import { InformationCircleIcon, HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import Share from '../Share';
import AdAlert from '../AdAlert';
import TableOfContents from '../TableOfContent';

const PrivacyPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
  const headings = [
    { id: 'introduction', title: '個人情報取り扱いに関する基本方針', level: 2 },
    { id: 'definition', title: '個人情報の定義', level: 2 },
    { id: 'acquisition', title: '個人情報の取得方法', level: 2 },
    { id: 'cookie', title: 'クッキー（Cookie）', level: 3 },
    { id: 'analytics', title: 'アクセス解析ツール', level: 3 },
    { id: 'comment', title: 'コメントについて', level: 3 },
    { id: 'purpose', title: '個人情報の利用目的', level: 2 },
    { id: 'advertisement', title: '当サイトが利用している広告サービス', level: 2 },
    { id: 'amazon', title: 'Amazonアソシエイトプログラム', level: 3 },
    { id: 'google', title: 'Googleアドセンス', level: 3 },
    { id: 'management', title: '個人情報の管理方法', level: 2 },
    { id: 'third-party', title: '個人情報の第三者提供', level: 2 },
    { id: 'disclosure', title: '個人情報の開示、訂正などの手続きについて', level: 2 },
    { id: 'disclaimer', title: '免責事項', level: 2 },
    { id: 'copyright', title: '著作権について', level: 2 },
    { id: 'link', title: 'リンクについて', level: 2 },
    { id: 'contact', title: '個人情報の取扱いに関する相談や苦情の連絡先', level: 2 },
  ];

  //出稿日
  const dummyDate = new Date(2023, 10, 27);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div>
      <main className={styles.main}>
        <div className="categoryTitle max-w-[85rem] sm:px-6 lg:px-8 mx-auto pb-2">
          <nav className="flex" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
              <li>
                <a href="/" className="flex text-gray-500 hover:text-blue-500">
                  <HomeIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRightIcon
                    className="h-4 w-4 flex-shrink-0 text-gray-400"
                    aria-hidden="true"
                  />
                  <a
                    href="/privacy"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-blue-500"
                  >
                    プライバシーポリシー
                  </a>
                </div>
              </li>
            </ol>
          </nav>
          <div className="flex items-center py-2 mt-7">
            <InformationCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
            <h1 className="text-3xl font-bold lg:text-3xl">プライバシーポリシー</h1>
          </div>
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="">
                <div className="space-y-5 lg:space-y-8">
                  <div className="includeBanner flex justify-end gap-x-5">
                    {/* <TagList tags={data.tags} /> */}
                    <PublishedDate date={formattedDate} />
                  </div>
                  <AdAlert />
                </div>
                <TableOfContents headings={headings} />
                <div className={`${styles.content} mt-10 mb-5`}>
                  <h2 id="introduction">個人情報取り扱いに関する基本方針</h2>
                  <p>
                    リアル大学生（以下、「当サイト」と言います。）では、ご利用頂くお客様の個人情報を適切に保護するため、個人情報の保護に関する法律、その他の関係法令を遵守すると共に、以下に定めるプライバシーポリシーに従って、個人情報を安全かつ適切に取り扱うことを宣言いたします。
                  </p>
                  <h2 id="definition">個人情報の定義</h2>
                  <p>
                    「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。
                  </p>
                  <h2 id="acquisition">個人情報の取得方法</h2>
                  <p>
                    当サイトはユーザーが利用登録をする際に氏名、住所、電話番号、メールアドレス、などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当サイトの提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。
                  </p>
                  <h3 id="cookie">クッキー（Cookie）</h3>
                  <p>
                    当サイトでは、アクセス解析サービス、各種アフィリエイトプログラム、広告配信サービスを利用しております。これらの広告配信業者は、ユーザーのご興味に応じた商品やサービスの広告を表示するため、ユーザーの当サイトおよび他サイトへのアクセスに関する情報Cookieを使用することがございます。
                    <br />
                    <br />
                    Cookieは、ユーザーが当サイトあるいは他サイトを閲覧された際、使用されたコンピューターやデバイス内に記録されます。ただし、この情報には、お名前・ご住所・メールアドレス・電話番号など個人を特定できるものは一切含まれません。
                    <br />
                    <br />
                    Cookieによる情報収集を好まれない場合、ユーザーご自身でブラウザで受け入れを拒否するよう設定することも可能です。ただし、この設定により一部のコンテンツが正しく機能しない場合、またサービスが受けられない場合がございます。あらかじめご了承ください。
                    <br />
                    <br />
                    なお、設定方法に関しては
                    <Link
                      href="https://policies.google.com/technologies/partner-sites?hl=ja"
                      className="text-blue-500 hover:text-blue-700"
                      target="blank"
                    >
                      Googleポリシーと規約
                    </Link>
                    にてご確認いただけます。
                  </p>
                  <h3 id="analytics">アクセス解析ツール</h3>
                  <p>
                    当サイトでは、Googleの提供するアクセス解析ツール『Google
                    Analytics』を使用しています。Google
                    Analyticsはトラフィックデータの収集のためCookieを利用します。このトラフィックデータは匿名で収集されており、個人を特定するものではございません。
                    <br />
                    <br />
                    ユーザーは、Cookieを無効化することにより、データの収集を拒否することができます。お使いのブラウザより設定をご確認ください。
                    <br />
                    <br />
                    なお、この規約に関しては、
                    <Link
                      href="https://marketingplatform.google.com/about/analytics/terms/jp/"
                      className="text-blue-500 hover:text-blue-700"
                      target="blank"
                    >
                      Googleアナリティクス利用規約
                    </Link>
                    および
                    <Link
                      href="https://policies.google.com/technologies/partner-sites?hl=ja"
                      className="text-blue-500 hover:text-blue-700"
                      target="blank"
                    >
                      Googleポリシーと規約
                    </Link>
                    でご確認いただけます。
                  </p>
                  <h3 id="comment">コメントについて</h3>
                  <p>
                    当ブログへのコメントを残す際に、IP アドレスを収集しています。
                    <br />
                    <br />
                    これはブログの標準機能としてサポートされている機能で、スパムや荒らしへの対応以外にこのIPアドレスを使用することはありません。
                    <br />
                    <br />
                    なお、全てのコメントは管理人が事前にその内容を確認し、承認した上での掲載となります。あらかじめご了承ください。
                  </p>
                  <h2 id="purpose">個人情報の利用目的</h2>
                  <p>
                    当サイトが個人情報を収集・利用する目的は、以下のとおりです。
                    <br />
                    <br />
                    当サイトのお問い合わせ際に、名前（ニックネーム）、メールアドレス等の個人情報を入力いただく場合がございます。
                    <br />
                    <br />
                    これらの個人情報は、質問に対する回答や必要な情報を電子メールなどでご連絡する場合に利用させていただくものであり、個人情報をご提供いただく際の目的以外では利用いたしません。
                    <br />
                    <br />
                    当サイトでは，有料のサービスを提供しております。その際の利用料金のご請求をするために利用しております。
                    <br />
                    <br />
                    その他に、当サイトを不正・不当な目的で利用しようとするユーザーがいた場合、ユーザーの特定をし、ご利用をお断りするために利用します。
                  </p>
                  <h2 id="advertisement">当サイトが利用している広告サービス</h2>
                  <p>
                    当サイトは、以下の第三者の配信する広告サービスならびにアフィリエイトプログラムを利用しております。
                  </p>
                  <ul>
                    <li>もしもアフィリエイト</li>
                    <li>レントラックスアフィリエイト</li>
                  </ul>
                  <p>
                    これらのサービスにおいて取得・収集される情報については、各プログラムのプライバシーポリシーにてご確認ください。
                  </p>
                  <h3 id="amazon">Amazonアソシエイトプログラム</h3>
                  <p>Amazonのアソシエイトとして、当メディアは適格販売により収入を得ています。</p>
                  <h3 id="google">Googleアドセンス</h3>
                  <p>
                    当サイトは、第三者配信の広告サービス「Google
                    Adsense（グーグルアドセンス）」を利用しています。当サイトにおいて広告が配信される過程で、Cookieやデバイス特有の情報、位置情報、当該デバイスから収集されるその他の情報が利用される場合があります。ただしその過程で個人を特定できる情報は収集されません。
                    <br />
                    <br />
                    また、Google
                    AdSenseに関して、このプロセスの詳細や情報が広告配信事業者に使用されないよう、ユーザーご自身で設定することができます。ただし、この設定により一部のコンテンツが正しく機能しない場合、またサービスが受けられない場合がございます。あらかじめご了承ください。
                    <br />
                    <br />
                    なお、この設定方法に関しては
                    <Link
                      href="https://policies.google.com/technologies/partner-sites?hl=ja"
                      className="text-blue-500 hover:text-blue-700"
                      target="blank"
                    >
                      Googleポリシーと規約
                    </Link>
                    にてご確認いただけます。
                  </p>
                  <h2 id="management">個人情報の管理方法</h2>
                  <p>
                    当サイトは第三者に皆さまの重要な情報を読み取られたり、改ざんされたりすることを防ぐために、SSLを使用しております。
                    <br />
                    <br />
                    SSL(SecureSocketLayer)とはデータを暗号化して通信するセキュリティ機能です。
                    SSLで暗号化することによってお客さまの個人情報をハッカーやクラッカーから守り、安全に情報を送信することができます。
                  </p>
                  <h2 id="third-party">個人情報の第三者提供</h2>
                  <p>
                    当サイトは次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく第三者に個人情報を提供することはありません。
                    <br />
                    <br />
                    ただし、個人情報保護法その他の法令で認められる場合を除きます。
                  </p>
                  <h2 id="disclosure">個人情報の開示、訂正などの手続きについて</h2>
                  <p>
                    ご本人からの個人情報の開示、訂正、追加、削除、利用停止のご希望の場合には、ご本人であることを確認させて頂いた上、速やかに対応させていただきます。
                  </p>
                  <h2 id="disclaimer">免責事項</h2>
                  <p>
                    当サイトからのリンクやバナーなどで移動したサイトで提供される情報、サービス等について一切の責任を負いません。
                    <br />
                    <br />
                    また当サイトのコンテンツ・情報について、できる限り正確な情報を提供するように努めておりますが、正確性や安全性を保証するものではありません。情報が古くなっていることもございます。
                    <br />
                    <br />
                    当サイトに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
                  </p>
                  <h2 id="copyright">著作権について</h2>
                  <p>
                    当サイトのコンテンツ（写真や画像、文章など）の著作権につきましては、
                    原則として当サイトに帰属しており、無断転載することを禁止します。
                    <br />
                    <br />
                    当サイトのコンテンツを利用したい場合は、別途お問い合わせください。
                  </p>
                  <h2 id="link">リンクについて</h2>
                  <p>
                    当サイトは完全リンクフリーです。リンクを行う場合の当サイトへの許可や連絡は不要です。
                  </p>
                  <h2 id="contact">個人情報の取扱いに関する相談や苦情の連絡先</h2>
                  <p>
                    本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。
                    <br />
                    <br />
                    サイト運営者：あお
                    <br />
                    連絡先：
                    <Link href="/contact" className="text-blue-500 hover:text-blue-700">
                      https://realunivlog.com/contact/
                    </Link>
                  </p>
                </div>
              </div>
              <Share />
            </div>
            <div className="mobile">
              <Sidebar articles={sidebarArticles.contents} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;
