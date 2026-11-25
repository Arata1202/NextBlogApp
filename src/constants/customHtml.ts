export const CUSTOM_HTML_SCRIPT_SRC_ATTRIBUTE = 'data-custom-html-script-src';
export const CUSTOM_HTML_MOSHIMO_SCRIPT_ATTRIBUTE = 'data-moshimo-easy-link-script';

const trustedEmbedScripts = new Set([
  'https://cdn.iframe.ly/embed.js',
  'https://www.instagram.com/embed.js',
]);

export function isTrustedEmbedScript(src: string): boolean {
  if (!URL.canParse(src, 'https://example.invalid')) return false;
  const url = new URL(src, 'https://example.invalid');
  return !url.username && !url.password && trustedEmbedScripts.has(url.origin + url.pathname);
}
