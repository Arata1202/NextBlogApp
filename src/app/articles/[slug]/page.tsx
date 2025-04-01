import { getDetail, getList, getAllLists, getAllTagLists } from '@/libs/microcms';
import { RECENT_LIMIT } from '@/constants/limit';
import ArticlePage from '@/components/Pages/Article';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const generateStaticParams = async () => {
  const data = await getAllLists({
    fields: 'id',
  });

  return data.map((slug) => ({ slug: slug.id }));
};

export default async function Page(props: Props) {
  const params = await props.params;

  const data = await getDetail(params.slug);
  const articles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,thumbnail',
  });
  const relatedArticles = await getList({
    limit: RECENT_LIMIT,
    fields: 'id,title,tags,description,thumbnail,publishedAt,updatedAt',
    filters: `categories[contains]${data.categories[0].id},title[not_equals]${data.title}`,
  });
  const tags = await getAllTagLists({
    fields: 'id,name',
  });

  return (
    <>
      <ArticlePage
        articles={articles.contents}
        article={data}
        relatedArticles={relatedArticles.contents}
        tags={tags}
      />
    </>
  );
}
