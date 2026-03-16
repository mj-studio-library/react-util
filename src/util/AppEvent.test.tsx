import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AppEvent, useAppEventListener, useAsyncAppEventListener } from './AppEvent';

const uniqueType = (name: string) => `${name}-${crypto.randomUUID()}`;

describe('AppEvent', () => {
  it('emits payloads to listeners and reports whether listeners exist', () => {
    const type = uniqueType('emit');
    const listener = vi.fn();

    AppEvent.addEventListener(type, listener);

    expect(AppEvent.emitEvent(type, { id: 1 })).toBe(true);
    expect(listener).toHaveBeenCalledWith({ id: 1 });

    AppEvent.removeEventListener(type, listener);

    expect(AppEvent.emitEvent(type, { id: 2 })).toBe(false);
  });

  it('awaits async listeners in registration order', async () => {
    const type = uniqueType('await');
    const calls: string[] = [];
    const first = vi.fn(async () => {
      calls.push('first:start');
      await Promise.resolve();
      calls.push('first:end');
    });

    const second = vi.fn(async () => {
      calls.push('second');
    });

    AppEvent.addEventListener(type, first);
    AppEvent.addEventListener(type, second);

    await AppEvent.awaitEmitEvent(type, undefined);

    expect(calls).toEqual(['first:start', 'first:end', 'second']);

    AppEvent.removeEventListener(type, first);
    AppEvent.removeEventListener(type, second);
  });

  it('subscribes and unsubscribes through useAppEventListener', () => {
    const type = uniqueType('hook');
    const listener = vi.fn();
    const unsubscribe = vi.fn();
    const { unmount } = renderHook(() => useAppEventListener(type, listener, unsubscribe));

    AppEvent.emitEvent(type, 'payload');
    expect(listener).toHaveBeenCalledWith('payload');

    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);

    AppEvent.emitEvent(type, 'another');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('supports async listeners through useAsyncAppEventListener', async () => {
    const type = uniqueType('async-hook');
    const listener = vi.fn(async (payload: number) => {
      void payload;
    });

    renderHook(() => useAsyncAppEventListener(type, listener));

    await AppEvent.awaitEmitEvent(type, 3);

    expect(listener).toHaveBeenCalledWith(3);
  });
});
