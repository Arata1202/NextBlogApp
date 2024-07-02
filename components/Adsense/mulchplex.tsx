import Script from 'next/script';
export default function Mulchplex() {
  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-1705865999592590"
        data-ad-slot="5469260892"
        data-ad-format="autorelaxed"
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
