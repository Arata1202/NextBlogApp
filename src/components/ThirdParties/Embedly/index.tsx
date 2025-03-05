import Script from 'next/script';

export default function Embedly() {
  return <Script async src="//cdn.iframe.ly/embed.js" strategy="afterInteractive" />;
}
