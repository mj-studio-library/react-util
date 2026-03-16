import { assertBrowserFeature } from './assertBrowserFeature';

const clipboardWriteTextReason = 'a browser runtime with navigator.clipboard.writeText';
const clipboardWriteReason = 'a browser runtime with navigator.clipboard.write and ClipboardItem';

/**
 * Copies text to the system clipboard in a browser runtime.
 *
 * This function throws when the Clipboard text API is unavailable.
 *
 * @param text - Text to copy.
 * @returns A promise that resolves after the text has been written.
 *
 * @example
 * await copyTextToClipboardDom('Hello world');
 */
export const copyTextToClipboardDom = async (text: string) => {
  assertBrowserFeature({
    apiName: 'copyTextToClipboardDom',
    check: typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function',
    reason: clipboardWriteTextReason,
  });

  await navigator.clipboard.writeText(text);
};

/**
 * Copies an image data URI to the system clipboard in a browser runtime.
 *
 * This function throws when `navigator.clipboard.write` or `ClipboardItem` is unavailable.
 *
 * @param dataURI - Image data URI to convert and write to the clipboard.
 * @returns A promise that resolves after the image has been written.
 *
 * @example
 * await copyImageToClipboardDom('data:image/png;base64,...');
 */
export const copyImageToClipboardDom = async (dataURI: string) => {
  assertBrowserFeature({
    apiName: 'copyImageToClipboardDom',
    check:
      typeof navigator !== 'undefined' &&
      typeof navigator.clipboard?.write === 'function' &&
      typeof ClipboardItem !== 'undefined',
    reason: clipboardWriteReason,
  });

  const blob = await (await fetch(dataURI)).blob();
  const item = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([item]);
};
