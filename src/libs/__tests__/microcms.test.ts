import { beforeEach, describe, expect, it, vi } from 'vitest';

const microcmsSdkMock = vi.hoisted(() => ({
  client: {
    getAllContents: vi.fn(),
    getList: vi.fn(),
    getListDetail: vi.fn(),
  },
  createClient: vi.fn(),
}));

vi.mock('microcms-js-sdk', () => ({
  createClient: microcmsSdkMock.createClient,
}));

describe('microcms client helpers', () => {
  beforeEach(() => {
    vi.resetModules();
    microcmsSdkMock.createClient.mockReset();
    microcmsSdkMock.createClient.mockReturnValue(microcmsSdkMock.client);
    microcmsSdkMock.client.getAllContents.mockReset();
    microcmsSdkMock.client.getList.mockReset();
    microcmsSdkMock.client.getListDetail.mockReset();
    process.env.MICROCMS_SERVICE_DOMAIN = 'service-domain';
    process.env.MICROCMS_API_KEY = 'api-key';
  });

  it('creates the SDK client from required environment variables', async () => {
    await import('@/libs/microcms');

    expect(microcmsSdkMock.createClient).toHaveBeenCalledWith({
      serviceDomain: 'service-domain',
      apiKey: 'api-key',
    });
  });

  it('delegates blog list and detail requests to the blog endpoint', async () => {
    const { getAllLists, getList, getDetail } = await import('@/libs/microcms');
    const queries = { fields: 'id,title' };

    microcmsSdkMock.client.getAllContents.mockResolvedValue([{ id: 'article-a' }]);
    microcmsSdkMock.client.getList.mockResolvedValue({ contents: [] });
    microcmsSdkMock.client.getListDetail.mockResolvedValue({ id: 'article-a' });

    await expect(getAllLists(queries)).resolves.toEqual([{ id: 'article-a' }]);
    await expect(getList(queries)).resolves.toEqual({ contents: [] });
    await expect(getDetail('article-a', queries)).resolves.toEqual({ id: 'article-a' });

    expect(microcmsSdkMock.client.getAllContents).toHaveBeenCalledWith({
      endpoint: 'blog',
      queries,
    });
    expect(microcmsSdkMock.client.getList).toHaveBeenCalledWith({
      endpoint: 'blog',
      queries,
    });
    expect(microcmsSdkMock.client.getListDetail).toHaveBeenCalledWith({
      endpoint: 'blog',
      contentId: 'article-a',
      queries,
    });
  });

  it('delegates category helpers to the categories endpoint', async () => {
    const { getAllCategoryLists, getCategoryList, getCategory } = await import('@/libs/microcms');
    const queries = { fields: 'id,name' };

    microcmsSdkMock.client.getAllContents.mockResolvedValue([{ id: 'category-a' }]);
    microcmsSdkMock.client.getList.mockResolvedValue({ contents: [] });
    microcmsSdkMock.client.getListDetail.mockResolvedValue({ id: 'category-a' });

    await getAllCategoryLists(queries);
    await getCategoryList(queries);
    await getCategory('category-a', queries);

    expect(microcmsSdkMock.client.getAllContents).toHaveBeenCalledWith({
      endpoint: 'categories',
      queries,
    });
    expect(microcmsSdkMock.client.getList).toHaveBeenCalledWith({
      endpoint: 'categories',
      queries,
    });
    expect(microcmsSdkMock.client.getListDetail).toHaveBeenCalledWith({
      endpoint: 'categories',
      contentId: 'category-a',
      queries,
    });
  });

  it('delegates tag helpers to the tags endpoint', async () => {
    const { getAllTagLists, getTagList, getTag } = await import('@/libs/microcms');
    const queries = { fields: 'id,name' };

    microcmsSdkMock.client.getAllContents.mockResolvedValue([{ id: 'tag-a' }]);
    microcmsSdkMock.client.getList.mockResolvedValue({ contents: [] });
    microcmsSdkMock.client.getListDetail.mockResolvedValue({ id: 'tag-a' });

    await getAllTagLists(queries);
    await getTagList(queries);
    await getTag('tag-a', queries);

    expect(microcmsSdkMock.client.getAllContents).toHaveBeenCalledWith({
      endpoint: 'tags',
      queries,
    });
    expect(microcmsSdkMock.client.getList).toHaveBeenCalledWith({
      endpoint: 'tags',
      queries,
    });
    expect(microcmsSdkMock.client.getListDetail).toHaveBeenCalledWith({
      endpoint: 'tags',
      contentId: 'tag-a',
      queries,
    });
  });

  it('propagates SDK failures to the caller', async () => {
    const { getList } = await import('@/libs/microcms');

    microcmsSdkMock.client.getList.mockRejectedValue(new Error('network error'));

    await expect(getList()).rejects.toThrow('network error');
  });

  it('throws during module initialization when required credentials are missing', async () => {
    delete process.env.MICROCMS_SERVICE_DOMAIN;

    await expect(import('@/libs/microcms')).rejects.toThrow('MICROCMS_SERVICE_DOMAIN is required');
  });
});
