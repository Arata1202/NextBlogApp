import { render } from '@testing-library/react';
import InArticle from '@/components/Adsense/InArticle';

describe('InArticle', () => {
  test('スナップショット（InArticle)', () => {
    const { asFragment } = render(<InArticle slot="" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
