import styles from './index.module.css';

const APP_STORE_BADGE = '/images/badge/app-store-badge-jp.svg';
const IPHONE_FRAME = '/images/apps/iphone-15-pro-max-frame.webp';
const CREATOR_APP_STORE_URL = 'https://apps.apple.com/jp/iphone/search?term=aratatakano';

const apps = [
  {
    name: 'Pocket Video',
    icon: '/images/apps/pocket-video-app-icon.webp',
    screenshot: '/images/apps/pocket-video-screenshot.webp',
  },
  {
    name: 'リアル大学生',
    icon: '/images/apps/real-student-app-icon.webp',
    screenshot: '/images/apps/real-student-screenshot.webp',
  },
] as const;

type PhoneMockupProps = {
  className: string;
  screenshot: string;
};

function PhoneMockup({ className, screenshot }: PhoneMockupProps) {
  return (
    <div className={`${styles.phoneMockup} ${className}`}>
      <img src={IPHONE_FRAME} alt="" width={300} height={587} className={styles.phoneFrame} />
      <img src={screenshot} alt="" width={360} height={780} className={styles.phoneScreen} />
    </div>
  );
}

export default function AppsPromo() {
  return (
    <section className={styles.appsPromo} aria-labelledby="apps-promo-title">
      <div className={styles.inner}>
        <div className={styles.content}>
          <h2 id="apps-promo-title" className={styles.title}>
            アプリも公開中！
          </h2>
          <ul className={styles.appList} aria-label="公開中のアプリ">
            {apps.map((app) => (
              <li key={app.name} className={styles.appItem}>
                <img src={app.icon} alt="" width={160} height={160} className={styles.appIcon} />
                <span className={styles.appName}>{app.name}</span>
              </li>
            ))}
          </ul>
          <a
            href={CREATOR_APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.creatorLink}
          >
            <img
              src={APP_STORE_BADGE}
              alt="App Storeからダウンロード"
              width={109}
              height={40}
              className={styles.storeBadge}
            />
          </a>
        </div>
        <div className={styles.preview} aria-hidden="true">
          {apps.map((app, index) => (
            <PhoneMockup
              key={app.name}
              className={index === 0 ? styles.phonePrimary : styles.phoneSecondary}
              screenshot={app.screenshot}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
