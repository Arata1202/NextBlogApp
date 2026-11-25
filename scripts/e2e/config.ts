export const port = Number(process.env.PLAYWRIGHT_PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PLAYWRIGHT_PORT must be an integer from 1 to 65535');
}

export const localOrigin = new URL(`http://127.0.0.1:${port}`).origin;
export const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localOrigin;
export const searchURL = process.env.NEXT_PUBLIC_API_SEARCH_URL ?? '/api/search';
export const contactURL = process.env.NEXT_PUBLIC_API_SENDEMAIL_URL ?? '/api/sendemail';
