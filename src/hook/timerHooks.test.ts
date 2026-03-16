import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useIntervalCallback } from './useIntervalCallback';
import { useTimeoutHandlers } from './useTimeoutHandlers';

describe('timer hooks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs useIntervalCallback immediately and on each interval', () => {
    const callback = vi.fn();

    renderHook(() => useIntervalCallback(callback, 1, true));

    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('clears earlier timeouts when useTimeoutHandlers is told to replace them', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result } = renderHook(() => useTimeoutHandlers());

    act(() => {
      result.current.setAutoClearTimeout(first, 1000);
      result.current.setAutoClearTimeout(second, 2000, { withClear: true });
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('clears pending timeouts when the hook unmounts', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useTimeoutHandlers());

    act(() => {
      result.current.setAutoClearTimeout(callback, 1000);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
