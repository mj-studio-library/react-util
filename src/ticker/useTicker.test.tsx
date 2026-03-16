import React, { useEffect } from 'react';
import { act, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useTicker } from './useTicker';

describe('useTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks tick state and completes at the target duration', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useTicker({ onComplete }));

    act(() => {
      result.current.startTicker({ durationSec: 2, intervalSec: 1 });
    });

    expect(result.current.status).toBe('run_progress');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(2);
    expect(result.current.status).toBe('complete');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('pauses and resumes the ticker without losing elapsed time', () => {
    const { result } = renderHook(() => useTicker());

    act(() => {
      result.current.startTicker({ durationSec: 3, intervalSec: 1 });
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(1);

    act(() => {
      result.current.pauseTicker();
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.tickSec).toBe(1);
    expect(result.current.status).toBe('run_pause');

    act(() => {
      result.current.resumeTicker();
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.tickSec).toBe(2);
    expect(result.current.status).toBe('run_progress');
  });

  it('propagates ticks to TickerComponent listeners even when local tick state is disabled', () => {
    function Harness() {
      const { TickerComponent, startTicker } = useTicker({
        disableTickSecUpdate: true,
      });

      useEffect(() => {
        startTicker({ durationSec: 2, intervalSec: 1 });
      }, [startTicker]);

      return (
        <TickerComponent>
          {({ tickSec }) => <div data-testid="component-tick">{tickSec}</div>}
        </TickerComponent>
      );
    }

    render(<Harness />);

    expect(screen.getByTestId('component-tick').textContent).toBe('0');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('component-tick').textContent).toBe('1');
  });
});
