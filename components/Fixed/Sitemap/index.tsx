import styles from '../index.module.css';
import PublishedDate from '@/components/Elements/Date';
import React from 'react';
import FixedSidebar from '@/components/Sidebars/FixedSidebar';
import Share from '../../Articles/Share';
import AdAlert from '../../Articles/AdAlert';
import Display from '../../Adsense/Display';

const SitemapPage: React.FC<{ sidebarArticles: any }> = ({ sidebarArticles }) => {
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
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="">
              <div className="FirstAd">
                <Display slot="7197259627" />
              </div>
              <div className="space-y-5 lg:space-y-8">
                <div className="includeBanner flex justify-end gap-x-5">
                  <PublishedDate date={formattedDate} />
                </div>
                <AdAlert />
                <div className={`${styles.content} mt-10 mb-5`}>
                  <h2>固定ページ</h2>
                  <ul>
                    <li>
                      <a href="/contact" className="text-blue-500 hover:text-blue-700">
                        お問い合わせ
                      </a>
                    </li>
                    <li>
                      <a href="/sitemap" className="text-blue-500 hover:text-blue-700">
                        サイトマップ
                      </a>
                    </li>
                    <li>
                      <a href="/profile" className="text-blue-500 hover:text-blue-700">
                        プロフィール
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="text-blue-500 hover:text-blue-700">
                        プライバシーポリシー
                      </a>
                    </li>
                    <li>
                      <a href="/disclaimer" className="text-blue-500 hover:text-blue-700">
                        免責事項
                      </a>
                    </li>
                    <li>
                      <a href="/copyright" className="text-blue-500 hover:text-blue-700">
                        著作権
                      </a>
                    </li>
                    <li>
                      <a href="/link" className="text-blue-500 hover:text-blue-700">
                        リンク
                      </a>
                    </li>
                  </ul>
                  <h2>カテゴリー</h2>
                  <ul>
                    <li>
                      <a href="/category/programming" className="text-blue-500 hover:text-blue-700">
                        プログラミング
                      </a>
                    </li>
                    <li>
                      <a href="/category/university" className="text-blue-500 hover:text-blue-700">
                        大学生活
                      </a>
                    </li>
                    <li>
                      <a href="/category/travel" className="text-blue-500 hover:text-blue-700">
                        旅行
                      </a>
                    </li>
                    <li>
                      <a href="/category/blog" className="text-blue-500 hover:text-blue-700">
                        ブログ
                      </a>
                    </li>
                  </ul>
                  <h2>投稿一覧</h2>
                  <ul>
                    {sidebarArticles.contents.map((article: any) => (
                      <li key={article.id}>
                        <a
                          href={`/articles/${article.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {article.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="FirstAd">
                <Display slot="1831092739" />
              </div>
              <Share />
            </div>
          </div>
          <div className="mobile">
            <FixedSidebar articles={sidebarArticles.contents} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SitemapPage;
