import { assertBrowserFeature } from './assertBrowserFeature';

const clipboardWriteTextReason = 'a browser runtime with navigator.clipboard.writeText';
const clipboardWriteReason = 'a browser runtime with navigator.clipboard.write and ClipboardItem';

export const copyTextToClipboardDom = async (text: string) => {
  assertBrowserFeature({
    apiName: 'copyTextToClipboardDom',
    check: typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function',
    reason: clipboardWriteTextReason,
  });

  await navigator.clipboard.writeText(text);
};

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
