import { afterEach, describe, expect, it } from 'vitest';

import { blurFocusDom } from './focus';

describe('blurFocusDom', () => {
  const originalBody = document.body;

  afterEach(() => {
    Object.defineProperty(document, 'body', {
      configurable: true,
      value: originalBody,
    });
    document.body.innerHTML = '';
  });

  it('moves focus away from the current element without leaving artifacts', () => {
    document.body.innerHTML = '<button id="start">start</button>';

    const button = document.getElementById('start') as HTMLButtonElement;

    button.focus();
    blurFocusDom();

    expect(document.activeElement).not.toBe(button);
    expect(document.querySelectorAll('#start')).toHaveLength(1);
    expect(document.body.children).toHaveLength(1);
  });

  it('throws when document.body is unavailable', () => {
    Object.defineProperty(document, 'body', {
      configurable: true,
      value: null,
    });

    expect(() => blurFocusDom()).toThrow(
      '[react-util] blurFocusDom requires a browser runtime with document.body.',
    );
  });
});
