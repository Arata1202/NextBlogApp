import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '../pages.global.css';
import styles from '../index.module.css';
import SearchField from '@/components/SearchField';
import Image from 'next/image';
import PublishedDate from '@/components/Date';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect, useRef } from 'react';
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { EnvelopeIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';
import Link from 'next/link';

const ContactPage: React.FC = () => {
  //出稿日
  const dummyDate = new Date(2024, 4, 4);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div>
      {/* プライバシーポリシー */}
      <Head>
        <title>プライバシーポリシー</title>
        <meta
          name="description"
          content="あなたのサイトのお問い合わせページです。ご質問やご意見があれば、お気軽にお問い合わせください。"
        />
        <meta property="og:title" content="お問い合わせ - あなたのサイト名" />
        <meta
          property="og:description"
          content="あなたのサイトのお問い合わせページです。ご質問やご意見があれば、お気軽にお問い合わせください。"
        />
        <meta property="og:image" content="アイキャッチ画像のURL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main className={styles.main}>
        <div className="max-w-[85rem] sm:px-6 lg:px-8 mx-auto mt-20">
          <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="py-8">
                <div className="space-y-5 lg:space-y-8">
                  <div className="flex items-center">
                    <InformationCircleIcon className="h-8 w-8 mr-2" aria-hidden="true" />
                    <h1 className="text-3xl font-bold lg:text-3xl">プライバシーポリシー</h1>
                  </div>
                  <div className="includeBanner flex justify-end gap-x-5">
                    {/* <TagList tags={data.tags} /> */}
                    <PublishedDate date={formattedDate} />
                  </div>
                  <p className="includeBanner text-center border border-gray-300 p-3">
                    記事内に広告が含まれています。
                  </p>
                </div>
                <div className="flex justify-center mt-8">
                  <nav
                    aria-label="Table of contents"
                    className="tableOfContent w-1/2 border border-gray-300 p-4"
                  >
                    <h1 className="text-center font-bold text-lg">目次</h1>
                    <ol style={{ listStyleType: 'none', paddingLeft: 0 }} className="mt-4">
                      {/* 目次の内容 */}
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#introduction" className="hover:text-blue-500">
                          1.&nbsp;&nbsp; 個人情報取り扱いに関する基本方針
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#definition" className="hover:text-blue-500">
                          2.&nbsp;&nbsp; 個人情報の定義
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#acquisition" className="hover:text-blue-500">
                          3.&nbsp;&nbsp; 個人情報の取得方法
                        </a>
                      </li>
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#cookie" className="hover:text-blue-500">
                          3.1.&nbsp;&nbsp; クッキー（Cookie）
                        </a>
                      </li>
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#analytics" className="hover:text-blue-500">
                          3.2.&nbsp;&nbsp; アクセス解析ツール
                        </a>
                      </li>
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#comment" className="hover:text-blue-500">
                          3.3.&nbsp;&nbsp; コメントについて
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#purpose" className="hover:text-blue-500">
                          4.&nbsp;&nbsp; 個人情報の利用目的
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#advertisement" className="hover:text-blue-500">
                          5.&nbsp;&nbsp; 当サイトが利用している広告サービス
                        </a>
                      </li>
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#amazon" className="hover:text-blue-500">
                          5.1.&nbsp;&nbsp; Amazonアソシエイトプログラム
                        </a>
                      </li>
                      <li style={{ marginLeft: '20px' }}>
                        <a href="#google" className="hover:text-blue-500">
                          5.2.&nbsp;&nbsp; Googleアドセンス
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#management" className="hover:text-blue-500">
                          6.&nbsp;&nbsp; 個人情報の管理方法
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#third-party" className="hover:text-blue-500">
                          7.&nbsp;&nbsp; 個人情報の第三者提供
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#disclosure" className="hover:text-blue-500">
                          8.&nbsp;&nbsp; 個人情報の開示、訂正などの手続きについて
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#disclaimer" className="hover:text-blue-500">
                          9.&nbsp;&nbsp; 免責事項
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#copyright" className="hover:text-blue-500">
                          10.&nbsp;&nbsp; 著作権について
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#link" className="hover:text-blue-500">
                          11.&nbsp;&nbsp; リンクについて
                        </a>
                      </li>
                      <li style={{ marginLeft: '0px' }}>
                        <a href="#contact" className="hover:text-blue-500">
                          12.&nbsp;&nbsp; 個人情報の取扱いに関する相談や苦情の連絡先
                        </a>
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className={`${styles.content} mt-10`}>
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
                    <li>楽天アフィリエイト</li>
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
                    <Link href="/fixed/contact" className="text-blue-500 hover:text-blue-700">
                      https://mochaccinoblog.com/contact/
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-1 lg:w-full lg:h-full">
              <div className="sidebar sticky top-0 start-0 lg:ps-8 py-7">
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold mb-5`}>
                    検索
                  </h1>
                  <SearchField />
                </div>
                {/* Profile Media */}
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold pb-5`}>
                    ブログ運営者
                  </h1>
                  <Image
                    className="mx-auto h-48 w-48 rounded-full md:h-56 md:w-56"
                    src="/images/blog/face.webp"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <h1 className="mt-6 text-2xl text-center font-semibold leading-7 tracking-tight text-gray-800">
                    <Link href="/fixed/profile" className="hover:text-blue-500">
                      リアル大学生｜あお
                    </Link>
                  </h1>
                  <div className="text-lg leading-6 text-gray-800 mt-5">
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                      <li>20歳</li>
                      <li>千葉県在住</li>
                      <li>文系大学生｜26卒</li>
                      <li>マーケティング学科</li>
                      <li>Webエンジニアインターンに参加（主にLaravelやVue.js）</li>
                      <li>プログラミングは大学生から開始。独学でPHPやJavaScriptなどを習得</li>
                    </ul>
                  </div>
                  <ul role="list" className="mt-6 flex justify-center gap-x-6">
                    <li>
                      <a
                        href="https://twitter.com/Aokumoblog"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <span className="sr-only">X</span>
                        <svg
                          className="h-8 w-8"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11.4678 8.77491L17.2961 2H15.915L10.8543 7.88256L6.81232 2H2.15039L8.26263 10.8955L2.15039 18H3.53159L8.87581 11.7878L13.1444 18H17.8063L11.4675 8.77491H11.4678ZM9.57608 10.9738L8.95678 10.0881L4.02925 3.03974H6.15068L10.1273 8.72795L10.7466 9.61374L15.9156 17.0075H13.7942L9.57608 10.9742V10.9738Z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/ao_realstudent/?hl=ja"
                        className="text-gray-400 hover:text-blue-500"
                      >
                        <span className="sr-only">Instagram</span>
                        <svg
                          className="h-8 w-8"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>
                    カテゴリー
                  </h1>
                  <nav className="grid gap-4 mt-5 md:mt-5" aria-label="Tabs" role="tablist">
                    <a
                      href="/tags/university"
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-3 border border-gray-300 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
                      id="tabs-with-card-item-1"
                      data-hs-tab="#tabs-with-card-1"
                      aria-controls="tabs-with-card-1"
                      role="tab"
                    >
                      <span className="flex">
                        <span className="grow">
                          <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                              <li>大学生活</li>
                            </ul>
                          </span>
                        </span>
                      </span>
                    </a>
                    <a
                      href="/tags/programming"
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start p-4 md:p-3 border-gray-300 border shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
                      id="tabs-with-card-item-1"
                      data-hs-tab="#tabs-with-card-1"
                      aria-controls="tabs-with-card-1"
                      role="tab"
                    >
                      <span className="flex">
                        <span className="grow">
                          <span className="block text-lg font-semibold hs-tab-active:text-blue-600 text-gray-800">
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                              <li>プログラミング</li>
                            </ul>
                          </span>
                        </span>
                      </span>
                    </a>
                  </nav>
                </div>

                <div className="bg-white pt-8 px-4 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>
                    人気の投稿
                  </h1>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/2.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title font-bold">
                          【乳頭温泉郷】鶴の湯に宿泊！予約方法やアクセスについて解説
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/3.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title">
                          【文系】大学生必見！大学でのリアルな持ち物を大公開【かばんの中身】
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                  <ol className="ArticleListItem_list border mt-5 border-gray-300 p-2 shadow-lg hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1">
                    <Link className="" href="/articles/profile">
                      <Image
                        src="/images/test/8.webp"
                        alt=""
                        className="ArticleListItem_image"
                        width="1600"
                        height="900"
                      />
                      <dl>
                        <dt className="ArticleListItem_title">
                          【勉強法】１か月で習得！PHP学習のおすすめロードマップを紹介【プログラミング】
                        </dt>
                      </dl>
                    </Link>
                  </ol>
                </div>
                {/* More sidebar content */}
              </div>
              {/* More sidebar content */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
