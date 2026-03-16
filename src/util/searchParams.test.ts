import { describe, expect, it } from 'vitest';

import { getSearchParams } from './searchParams';

describe('getSearchParams', () => {
  it('serializes record values', () => {
    expect(getSearchParams({ q: 'react util', page: '2' })).toBe('q=react+util&page=2');
  });

  it('passes through URLSearchParams-compatible inputs', () => {
    expect(getSearchParams(new URLSearchParams('a=1&b=2'))).toBe('a=1&b=2');
    expect(getSearchParams('a=1&b=2')).toBe('a=1&b=2');
    expect(
      getSearchParams([
        ['a', '1'],
        ['b', '2'],
      ]),
    ).toBe('a=1&b=2');
  });
});
