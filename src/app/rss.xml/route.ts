import { generateRssFeedXml } from '@/libs/rss';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(await generateRssFeedXml(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
