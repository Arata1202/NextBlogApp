import Script from 'next/script';

export default function Instagram() {
  return <Script async strategy="afterInteractive" src="//www.instagram.com/embed.js" />;
}
