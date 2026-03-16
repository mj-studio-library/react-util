import { assertBrowserFeature } from './assertBrowserFeature';

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
