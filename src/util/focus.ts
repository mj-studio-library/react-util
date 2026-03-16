import { assertBrowserFeature } from './assertBrowserFeature';

/**
 * Removes focus from the currently focused element in a browser runtime.
 *
 * This function throws when the required DOM APIs are unavailable.
 *
 * @returns Nothing.
 *
 * @example
 * blurFocusDom();
 */
export function blurFocusDom() {
  assertBrowserFeature({
    apiName: 'blurFocusDom',
    check:
      typeof document !== 'undefined' &&
      typeof document.createElement === 'function' &&
      document.body !== null,
    reason: 'a browser runtime with document.body',
  });

  const tempDiv = document.createElement('div');
  tempDiv.tabIndex = -1;
  document.body.appendChild(tempDiv);
  tempDiv.focus();
  document.body.removeChild(tempDiv);
}
