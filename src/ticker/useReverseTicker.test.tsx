import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useReverseTicker } from './useReverseTicker';

describe('useReverseTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('counts down from the provided duration', () => {
    const { result } = renderHook(() => useReverseTicker({}));

    act(() => {
      result.current.startTicker({ durationSec: 3, intervalSec: 1 });
    });

    expect(result.current.tickSec).toBe(3);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(2);
  });

  it('resets the remaining duration', () => {
    const { result } = renderHook(() => useReverseTicker({}));

    act(() => {
      result.current.startTicker({ durationSec: 3, intervalSec: 1 });
      result.current.resetTicker();
    });

    expect(result.current.tickSec).toBe(0);
    expect(result.current.status).toBe('initial');
  });
});
