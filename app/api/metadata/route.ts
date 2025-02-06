import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  const { data } = await axios.get(url!);
  const $ = cheerio.load(data);

  const title = $('meta[property="og:title"]').attr('content') || $('title').text();
  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content');
  const image = $('meta[property="og:image"]').attr('content');

  return NextResponse.json({ title, description, image });
}
