import Script from 'next/script';
export default function InArticle() {
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-1705865999592590"
        data-ad-slot="8095424230"
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
