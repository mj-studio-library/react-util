import React from 'react';
import { renderToString } from 'react-dom/server';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useBeforeunloadDom } from './useBeforeunload';

describe('useBeforeunloadDom', () => {
  const originalAddEventListener = window.addEventListener;
  const originalWindow = window;

  afterEach(() => {
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: originalWindow,
    });

    Object.defineProperty(originalWindow, 'addEventListener', {
      configurable: true,
      value: originalAddEventListener,
    });
    vi.restoreAllMocks();
  });

  it('registers and removes a beforeunload listener', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const handler = vi.fn(() => 'leave');
    const { unmount } = renderHook(() => useBeforeunloadDom(handler));
    const listener = addSpy.mock.calls[0]?.[1] as (event: BeforeUnloadEvent) => unknown;
    const event = new Event('beforeunload', { cancelable: true }) as BeforeUnloadEvent;

    Object.defineProperty(event, 'returnValue', {
      configurable: true,
      writable: true,
      value: undefined,
    });

    listener(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(event.returnValue).toBe('leave');

    unmount();

    expect(removeSpy).toHaveBeenCalledWith('beforeunload', listener);
  });

  it('throws when browser event APIs are unavailable', () => {
    function Harness() {
      useBeforeunloadDom(() => undefined);

      return null;
    }

    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: undefined,
    });
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderToString(<Harness />)).toThrow(
      '[react-util] useBeforeunloadDom requires a browser runtime with window.beforeunload events.',
    );
  });
});
