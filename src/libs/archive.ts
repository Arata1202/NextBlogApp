import { getAllLists } from './microcms';

export type ArchiveItem = {
  year: string;
  month: string;
};

export async function getArchiveList(): Promise<ArchiveItem[]> {
  const articles = await getAllLists({
    fields: 'publishedAt',
  });

  const dateSet = new Set<string>();

  articles.forEach((article) => {
    if (article.publishedAt) {
      const date = new Date(article.publishedAt);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString();
      dateSet.add(`${year}-${month}`);
    }
  });

  const archiveList = Array.from(dateSet)
    .map((dateStr) => {
      const [year, month] = dateStr.split('-');
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) {
        return parseInt(b.year) - parseInt(a.year);
      }
      return parseInt(b.month) - parseInt(a.month);
    });

  return archiveList;
}

export async function getArchiveStaticParams() {
  const archiveList = await getArchiveList();

  return archiveList.map(({ year, month }) => {
    const formattedMonth = month.padStart(2, '0');
    return {
      year,
      month: formattedMonth,
    };
  });
}
