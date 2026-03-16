import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Ticker } from './Ticker';

describe('Ticker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('tracks elapsed seconds across pause and resume', () => {
    const handler = vi.fn();
    const ticker = new Ticker();

    ticker.start({ handler, intervalSec: 1, tickMillis: 1000 });

    vi.advanceTimersByTime(1000);
    expect(handler).toHaveBeenLastCalledWith(1);

    ticker.pause();
    vi.advanceTimersByTime(2000);
    expect(handler).toHaveBeenCalledTimes(1);

    ticker.resume();
    vi.advanceTimersByTime(1000);

    expect(handler).toHaveBeenLastCalledWith(2);
    expect(ticker.status).toBe('progress');
  });

  it('resets internal state and stops ticking', () => {
    const handler = vi.fn();
    const ticker = new Ticker();

    ticker.start({ handler, intervalSec: 1, tickMillis: 1000 });
    vi.advanceTimersByTime(1000);

    ticker.reset();
    vi.advanceTimersByTime(1000);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(ticker.status).toBe('initial');
  });
});
