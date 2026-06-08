import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getZennFeed } from '@/libs/zenn';

describe('getZennFeed', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  it('maps RSS items to unified articles', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => `
        <rss>
          <channel>
            <item>
              <title> First article </title>
              <link>https://zenn.dev/user/articles/first</link>
              <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
              <description><![CDATA[<p>First <strong>description</strong></p>]]></description>
              <enclosure url="https://example.com/first.png" />
            </item>
            <item>
              <title>Second article</title>
              <link>https://zenn.dev/user/articles/second</link>
              <pubDate>Tue, 02 Jan 2024 00:00:00 GMT</pubDate>
              <description><![CDATA[${'<p>Long text</p>'.repeat(30)}]]></description>
              <content:encoded><![CDATA[<p><img src="https://example.com/content.png"></p>]]></content:encoded>
            </item>
          </channel>
        </rss>
      `,
    });

    const result = await getZennFeed('user', 2);

    expect(fetchMock).toHaveBeenCalledWith('https://zenn.dev/user/feed', {
      next: { revalidate: 3600 },
    });
    expect(result).toEqual([
      {
        id: 'zenn-first',
        title: 'First article',
        description: 'First description',
        publishedAt: 'Mon, 01 Jan 2024 00:00:00 GMT',
        url: 'https://zenn.dev/user/articles/first',
        thumbnailUrl: 'https://example.com/first.png',
        source: 'zenn',
      },
      expect.objectContaining({
        id: 'zenn-second',
        thumbnailUrl: 'https://example.com/content.png',
        source: 'zenn',
      }),
    ]);
    expect(result[1].description).toHaveLength(140);
    expect(result[1].description.endsWith('…')).toBe(true);
  });

  it('uses the all-items RSS feed only when explicitly requested', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '<rss><channel></channel></rss>',
    });

    await getZennFeed('user', 50, { includeAll: true });

    expect(fetchMock).toHaveBeenCalledWith('https://zenn.dev/user/feed?all=1', {
      next: { revalidate: 3600 },
    });
  });

  it('returns an empty list when the RSS request fails', async () => {
    fetchMock.mockResolvedValue({ ok: false });

    await expect(getZennFeed('user')).resolves.toEqual([]);
  });

  it('returns an empty list when fetching throws', async () => {
    fetchMock.mockRejectedValue(new Error('network error'));

    await expect(getZennFeed('user')).resolves.toEqual([]);
  });
});
