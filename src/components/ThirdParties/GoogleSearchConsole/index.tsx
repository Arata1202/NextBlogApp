export default function GoogleSearchConsole() {
  return <meta name="google-site-verification" content={process.env.SEARCH_CONSOLE_ID} />;
}
