export default function MobileBanner() {
  return (
    <div className="flex justify-center mt-20" style={{ backgroundColor: '#d9d9d9' }}>
      <div style={{ position: 'relative', width: '700px' }}>
        <img
          loading="lazy"
          style={{ padding: '0 12px' }}
          src="/images/blog/mobilebanner.png"
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
            className="hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
          >
            <img
              src="/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"
              alt="Download on the App Store"
              style={{ height: '40px' }}
              className="app-badge"
            />
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.realunivlog.flutterblogapp"
            target="_blank"
            className="app-badge-link hover:shadow-xl transition-shadow duration-200 transform hover:-translate-y-1"
            style={{ marginLeft: '10%' }}
          >
            <img
              src="/GetItOnGooglePlay_Badge_Web_color_English.png"
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
