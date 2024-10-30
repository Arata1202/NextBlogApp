import { render } from '@testing-library/react';
import InArticle from '@/components/Adsense/InArticle';

describe('InArticle', () => {
  test('スナップショット（InArticle)', () => {
    const { asFragment } = render(<InArticle slot="00000" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
