import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { copyImageToClipboardDom, copyTextToClipboardDom } from './clipboard';

class ClipboardItemMock {
  constructor(public items: Record<string, Blob>) {}
}

describe('clipboard', () => {
  const originalClipboard = navigator.clipboard;
  const originalClipboardItem = globalThis.ClipboardItem;

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });

    if (originalClipboardItem) {
      vi.stubGlobal('ClipboardItem', originalClipboardItem);
    }
  });

  afterEach(() => {
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    });

    if (originalClipboardItem) {
      vi.stubGlobal('ClipboardItem', originalClipboardItem);
    } else {
      Reflect.deleteProperty(globalThis, 'ClipboardItem');
    }

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('writes text with navigator.clipboard.writeText', async () => {
    const writeText = vi.fn();

    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    await copyTextToClipboardDom('hello');

    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('throws when text clipboard support is unavailable', async () => {
    await expect(copyTextToClipboardDom('hello')).rejects.toThrow(
      '[react-util] copyTextToClipboardDom requires a browser runtime with navigator.clipboard.writeText.',
    );
  });

  it('creates a clipboard item and writes image data', async () => {
    const write = vi.fn();
    const blob = new Blob(['binary'], { type: 'image/png' });

    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { write },
    });
    vi.stubGlobal('ClipboardItem', ClipboardItemMock);
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      blob: async () => blob,
    } as Response);

    await copyImageToClipboardDom('data:image/png;base64,Zm9v');

    expect(write).toHaveBeenCalledTimes(1);
    expect(write.mock.calls[0]?.[0]).toHaveLength(1);
    expect(write.mock.calls[0]?.[0]?.[0]).toBeInstanceOf(ClipboardItemMock);
    expect((write.mock.calls[0]?.[0]?.[0] as ClipboardItemMock).items).toEqual({
      'image/png': blob,
    });
  });
});
