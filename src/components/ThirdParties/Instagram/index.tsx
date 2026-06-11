import Script from 'next/script';

export default function Instagram() {
  return <Script async strategy="afterInteractive" src="https://www.instagram.com/embed.js" />;
}
