import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDueDateTicker } from './useDueDateTicker';

describe('useDueDateTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts from a future unix timestamp and counts down', () => {
    const { result } = renderHook(() => useDueDateTicker());

    act(() => {
      result.current.startTickerWithUnixSec(Math.floor(Date.now() / 1000) + 3);
    });

    expect(result.current.tickSec).toBe(3);
    expect(result.current.isExpired).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(2);
  });

  it('accepts millisecond timestamps and marks past dates as expired', () => {
    const { result } = renderHook(() => useDueDateTicker());

    act(() => {
      result.current.startTickerWithUnixSec(Date.now() + 2000);
    });

    expect(result.current.tickSec).toBe(2);

    act(() => {
      result.current.startTickerWithUnixSec(Math.floor(Date.now() / 1000) - 1);
    });

    expect(result.current.isExpired).toBe(true);
  });

  it('ignores invalid ISO strings', () => {
    const { result } = renderHook(() => useDueDateTicker());

    act(() => {
      result.current.startTickerWithISO8601('invalid');
    });

    expect(result.current.tickSec).toBe(0);
    expect(result.current.isExpired).toBe(false);
  });
});
