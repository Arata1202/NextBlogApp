import { YouTube } from '@/types/youtube';

export async function getYouTubeList(): Promise<YouTube[]> {
  const youtubeApiKey = process.env.YOUTUBE_API_KEY;
  const youtubeChannelId = process.env.YOUTUBE_CHANNEL_ID;

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&channelId=${youtubeChannelId}&part=snippet,id&order=date&maxResults=3&type=video`,
  );

  const data = await response.json();

  const videos = data.items.slice(0, 3).map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.medium.url,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));

  return videos;
}
