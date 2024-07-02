import Script from 'next/script';
export default function Mulchplex() {
  return (
    <div style={{ maxWidth: '100%' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-1705865999592590"
        data-ad-slot="5469260892"
      ></ins>
      <Script id="adsbygoogle-init" strategy="lazyOnload">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({});
        `}
      </Script>
    </div>
  );
}
