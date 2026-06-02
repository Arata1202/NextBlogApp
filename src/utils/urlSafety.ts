const DEFAULT_BASE_URL = 'https://example.invalid';

export const SAFE_NAVIGATION_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);
export const SAFE_RESOURCE_PROTOCOLS = new Set(['http:', 'https:']);

const hasControlCharacters = (value: string) => {
  for (let index = 0; index < value.length; index += 1) {
    const codePoint = value.charCodeAt(index);

    if (codePoint <= 0x1f || codePoint === 0x7f) {
      return true;
    }
  }

  return false;
};

export const parseUrl = (value: string, baseUrl = DEFAULT_BASE_URL) => {
  const trimmedValue = value.trim();

  if (!trimmedValue || hasControlCharacters(trimmedValue)) {
    return null;
  }

  try {
    return new URL(trimmedValue, baseUrl);
  } catch {
    return null;
  }
};

export const hasSafeUrlProtocol = (
  value: string,
  allowedProtocols: ReadonlySet<string> = SAFE_NAVIGATION_PROTOCOLS,
) => {
  const url = parseUrl(value);

  return Boolean(url && allowedProtocols.has(url.protocol));
};
