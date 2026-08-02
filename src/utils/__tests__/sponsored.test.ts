import { describe, expect, it } from 'vitest';
import {
  assertValidSponsoredArticle,
  includeSponsoredFields,
  isSponsorLink,
  mergeSponsoredRel,
} from '@/utils/sponsored';
import { createArticle } from '@/test/factories';

describe('sponsored article utilities', () => {
  it('matches the sponsor hostname and its subdomains without matching lookalike domains', () => {
    const sponsorUrl = 'https://www.sponsor.example/campaign';

    expect(isSponsorLink('https://sponsor.example/product', sponsorUrl)).toBe(true);
    expect(isSponsorLink('https://shop.sponsor.example/product', sponsorUrl)).toBe(true);
    expect(isSponsorLink('https://sponsor.example.evil.test/product', sponsorUrl)).toBe(false);
    expect(isSponsorLink('/internal-link', sponsorUrl)).toBe(false);
  });

  it('adds sponsored without removing existing rel values', () => {
    expect(mergeSponsoredRel('noopener noreferrer')).toBe('noopener noreferrer sponsored');
    expect(mergeSponsoredRel('sponsored')).toBe('sponsored');
  });

  it('requires a valid sponsor URL only for sponsored articles', () => {
    expect(() => assertValidSponsoredArticle(createArticle())).not.toThrow();
    expect(() => assertValidSponsoredArticle(createArticle({ isSponsored: true }))).toThrow(
      /sponsorUrl/,
    );
    expect(() =>
      assertValidSponsoredArticle(
        createArticle({
          isSponsored: true,
          sponsorUrl: 'https://sponsor.example',
        }),
      ),
    ).not.toThrow();
  });

  it('includes sponsored fields in partial microCMS queries', () => {
    expect(includeSponsoredFields('id,title')).toBe('id,title,isSponsored,sponsorUrl');
    expect(includeSponsoredFields(['id', 'title'])).toEqual([
      'id',
      'title',
      'isSponsored',
      'sponsorUrl',
    ]);
    expect(includeSponsoredFields('')).toBe('');
  });
});
