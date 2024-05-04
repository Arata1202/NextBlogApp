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
import { EnvelopeIcon } from '@heroicons/react/20/solid';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Head from 'next/head';

const ContactPage: React.FC = () => {
  //出稿日
  const dummyDate = new Date(2024, 4, 4);
  const formattedDate = dummyDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [show, setContactConfirmShow] = useState(false);
  const cancelButtonRef = useRef(null);

  //recaptcha
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const onChange = (value: string | null) => {
    console.log('Captcha value:', value);
    setCaptchaValue(value);
  };
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  //バリデーション
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  interface FormData {
    sei: string;
    mei: string;
    email: string;
    company: string;
    tel: string;
    message: string;
    honeypot: string;
  }

  //問い合わせ
  const [formData, setContactFormData] = useState<FormData | null>(null);
  const [open, setContactDialogOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    if (!data.honeypot) {
      setContactFormData(data);
      setContactDialogOpen(true);
    } else {
      return;
    }
  };
  const sendEmail = () => {
    if (!formData) return;

    fetch('https://microcmsblog.aratasportfolio.com/email.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sei: formData.sei,
        mei: formData.mei,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          console.log('Email sent successfully');
          setContactConfirmShow(true);
          reset();
          resetCaptcha();
          setContactDialogOpen(false);
        } else {
          console.log('Failed to send email');
          setContactConfirmShow(false);
        }
      })
      .catch((error) => console.error('Error sending email:', error));
  };
  const handleConfirmSend = () => {
    const verifyCaptcha = async () => {
      try {
        const response = await fetch('https://microcmsblog.aratasportfolio.com/recaptcha.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `g-recaptcha-response=${captchaValue}`,
        });
        const data = await response.json();
        if (data.success) {
          sendEmail();
        } else {
          console.error('reCAPTCHA検証に失敗しました:', data.message);
        }
      } catch (error) {
        console.error('reCAPTCHAの検証中にエラーが発生しました:', error);
      }
    };

    verifyCaptcha();
  };
  const handleCancel = () => {
    setContactDialogOpen(false);
  };

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setContactConfirmShow(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <div>
      {/* metaデータ */}
      <Head>
        <title>お問い合わせ</title>
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
                  <h1 className="text-3xl font-bold lg:text-3xl">お問い合わせ</h1>
                  <div className="includeBanner flex justify-end gap-x-5">
                    {/* <TagList tags={data.tags} /> */}
                    <PublishedDate date={formattedDate} />
                  </div>
                  <p className="includeBanner text-center border border-gray-300 p-3">
                    記事内に広告が含まれています。
                  </p>
                </div>
                <p className="mt-10">
                  当ブログに関するご質問やお気づきの点がございましたら、お気軽にお問い合わせください。
                  お問い合わせから2～3日中にはご返信させていただきます。
                </p>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  method="POST"
                  className="pt-20  py-0 sm:py-10 "
                >
                  <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-semibold leading-6 text-gray-800"
                      >
                        氏名
                      </label>
                      <div className="mt-2.5">
                        <input
                          placeholder="東洋 太郎"
                          {...register('sei', { required: '※ 氏名を入力してください' })}
                          type="text"
                          name="sei"
                          id="sei"
                          autoComplete="given-name"
                          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                        {errors.sei && <p className="text-red-500">{errors.sei.message}</p>}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-semibold leading-6 text-gray-800"
                      >
                        題名
                      </label>
                      <div className="mt-2.5">
                        <input
                          placeholder="タイトル"
                          {...register('mei', { required: '※ 題名を入力してください' })}
                          type="text"
                          name="mei"
                          id="mei"
                          autoComplete="family-name"
                          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                        {errors.mei && <p className="text-red-500">{errors.mei.message}</p>}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold leading-6 text-gray-800"
                      >
                        メールアドレス
                      </label>
                      <div className="mt-2.5">
                        <input
                          placeholder="example@example.com"
                          {...register('email', {
                            required: '※ メールアドレスを入力してください',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: '※ 有効なメールアドレスを入力してください',
                            },
                          })}
                          type="text"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold leading-6 text-gray-800"
                      >
                        内容
                      </label>
                      <div className="mt-2.5">
                        <textarea
                          placeholder="お問い合わせです。"
                          {...register('message', { required: '※ 内容を入力してください' })}
                          name="message"
                          id="message"
                          rows={4}
                          className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 text-gray-800 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
                          defaultValue={''}
                        />
                        {errors.message && <p className="text-red-500">{errors.message.message}</p>}
                      </div>
                    </div>
                  </div>
                  {/* スパム */}
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LcslaspAAAAAA15eqFJy4_vL856A7uu4ANjeqId"
                    onChange={onChange}
                    className="mt-3"
                  />
                  <div className="mt-3">
                    <button
                      type="submit"
                      disabled={!captchaValue}
                      className="block w-full rounded-md bg-white px-3.5 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-s border border-gray-300"
                    >
                      送信
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="lg:col-span-1 lg:w-full lg:h-full">
              <div className="sidebar sticky top-0 start-0 lg:ps-8 py-7">
                <div className="bg-white px-8 border border-gray-300 py-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold mb-5`}>
                    検索
                  </h1>
                  <SearchField />
                </div>
                {/* Profile Media */}
                <div className="bg-white px-8 border border-gray-300 py-5 mt-5">
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
                    <a href="" className="hover:text-blue-500">
                      リアル大学生｜あお
                    </a>
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
                <div className="bg-white px-8 border border-gray-300 py-5 mt-5">
                  <h1 className={`${styles.profile} text-2xl text-center font-semibold`}>
                    カテゴリー
                  </h1>
                  <nav className="grid gap-4 mt-5 md:mt-5" aria-label="Tabs" role="tablist">
                    <a
                      href="/tags/university"
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:border-blue-500 p-4 md:p-3 border border-gray-300"
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
                      className="hs-tab-active:bg-white hs-tab-active:shadow-md hs-tab-active:hover:border-transparent text-start hover:border-blue-500 p-4 md:p-3 border border-gray-300"
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
              </div>

              {/* More sidebar content */}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* 送信確認モーダル */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setContactDialogOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <EnvelopeIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h1"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        お問い合わせを送信しますか？
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          お問い合わせの内容は、ポートフォリオの作成者に共有されます。
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleCancel}
                      ref={cancelButtonRef}
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                      onClick={handleConfirmSend}
                    >
                      送信
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* 送信完了アラート */}
      <div
        aria-live="assertive"
        className="confirmAlert pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
      >
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">
                      お問い合わせありがとうございます
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      数日以内にご連絡いたしますので、しばらくお待ちください。
                    </p>
                  </div>
                  <div className="ml-4 flex flex-shrink-0">
                    <button
                      type="button"
                      className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setContactConfirmShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
