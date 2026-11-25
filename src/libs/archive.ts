import { formatInTimeZone } from 'date-fns-tz';
import { DISPLAY_TIME_ZONE } from '@/utils/formatDate';
import { getAllLists } from './microcms';

export type ArchiveItem = { year: string; month: string };

async function getArchiveCounts() {
  const articles = await getAllLists({ fields: 'publishedAt' });
  const months = new Map<string, number>();
  for (const { publishedAt } of articles) {
    if (!publishedAt || !Number.isFinite(Date.parse(publishedAt))) continue;
    const key = formatInTimeZone(publishedAt, DISPLAY_TIME_ZONE, 'yyyy-MM');
    months.set(key, (months.get(key) ?? 0) + 1);
  }
  return [...months.keys()]
    .sort()
    .reverse()
    .map((key) => {
      const [year, month] = key.split('-');
      return { year, month, count: months.get(key)! };
    });
}

export async function getArchiveList(): Promise<ArchiveItem[]> {
  return (await getArchiveCounts()).map(({ year, month }) => ({
    year,
    month: String(Number(month)),
  }));
}

export async function getArchiveStaticParams() {
  return (await getArchiveCounts()).map(({ year, month }) => ({ year, month }));
}

export async function getArchivePageParams(limit: number) {
  return (await getArchiveCounts()).flatMap(({ year, month, count }) =>
    Array.from({ length: Math.ceil(count / limit) }, (_, i) => ({
      year,
      month,
      current: String(i + 1),
    })),
  );
}

export function getArchiveFilter(year: string, month: string) {
  const start = new Date(`${year}-${month}-01T00:00:00+09:00`);
  const end = new Date(Date.UTC(Number(year), Number(month), 1, -9));
  // The CMS lower bound is exclusive and its timestamps have millisecond precision.
  return `publishedAt[greater_than]${new Date(start.getTime() - 1).toISOString()}[and]publishedAt[less_than]${end.toISOString()}`;
}
