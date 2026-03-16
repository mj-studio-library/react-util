import { describe, expect, it } from 'vitest';

import { assertBrowserFeature } from './assertBrowserFeature';

describe('assertBrowserFeature', () => {
  it('passes when the feature is available', () => {
    expect(() => {
      assertBrowserFeature({
        apiName: 'copyTextToClipboardDom',
        check: true,
        reason: 'a browser runtime',
      });
    }).not.toThrow();
  });

  it('throws a descriptive error when the feature is unavailable', () => {
    expect(() => {
      assertBrowserFeature({
        apiName: 'copyTextToClipboardDom',
        check: false,
        reason: 'a browser runtime',
      });
    }).toThrow('[react-util] copyTextToClipboardDom requires a browser runtime.');
  });
});
