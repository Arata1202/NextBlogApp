'use client';
import { useTheme } from 'next-themes';
export default function MobileBanner() {
  const { theme } = useTheme();
  return (
    <div className={`flex justify-center mt-20 ${theme === 'dark' ? 'bg-gray-500' : 'd9d9d9'}`}>
      <div style={{ position: 'relative', width: '700px' }}>
        <img
          loading="lazy"
          style={{ padding: '0 12px' }}
          src={
            theme === 'dark'
              ? '/images/blog/mobilebanner-dark.png'
              : '/images/blog/mobilebanner.png'
          }
          alt=""
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '15px',
            display: 'flex',
            justifyContent: 'center',
            width: '45%',
          }}
        >
          <a
            href="https://apps.apple.com/jp/app/リアル大学生-モバイル/id6590619103"
            target="_blank"
            className="hover:opacity-60"
          >
            <img
              src="/images/badge/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
              alt="Download on the App Store"
              style={{ height: '40px' }}
              className="app-badge"
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.realunivlog.flutterblogapp"
            target="_blank"
            className="app-badge-link hover:opacity-60"
            style={{ marginLeft: '10%' }}
          >
            <img
              src="/images/badge/GetItOnGooglePlay_Badge_Web_color_English.png"
              alt="Download on the Play Store"
              style={{ height: '40px' }}
              className="app-badge"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
