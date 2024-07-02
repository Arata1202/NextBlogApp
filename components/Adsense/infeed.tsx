import Script from 'next/script';
export default function InFeed() {
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-format="fluid"
        data-ad-layout-key="-5k+co+1n-b5+e3"
        data-ad-client="ca-pub-1705865999592590"
        data-ad-slot="1678694276"
        data-full-width-responsive="false"
      ></ins>
      <Script id="adsbygoogle-init" strategy="lazyOnload">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
      </Script>
    </div>
  );
}
