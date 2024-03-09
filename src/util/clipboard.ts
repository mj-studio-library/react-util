export const copyTextToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const copyImageToClipboard = async (dataURI: string) => {
  const blob = await (await fetch(dataURI)).blob();
  const item = new ClipboardItem({ [blob.type]: blob });
  await navigator.clipboard.write([item]);
};
