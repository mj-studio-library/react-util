import { setIntervalWithTimeout } from '@mj-studio/js-util';

function currentUnixMs(): number {
  return Date.now();
}

/**
 * Lifecycle states used by `Ticker`.
 */
export type TickerStatus = 'initial' | 'pause' | 'progress';

/**
 * Receives the elapsed time in ticker units.
 */
export type TickerHandler = (elapsedSec: number) => void;

/**
 * Imperative ticker that emits elapsed time on a fixed interval.
 *
 * @example
 * const ticker = new Ticker();
 *
 * ticker.start({
 *   handler: (elapsedSec) => {
 *     console.log(elapsedSec);
 *   },
 * });
 */
export class Ticker {
  private clear?: Function;

  private accumulatedMs = 0;
  private lastStartedUnixMs = 0;

  /**
   * Current lifecycle state of the ticker.
   */
  status: TickerStatus = 'initial';

  handler?: TickerHandler;

  constructor(
    private intervalSec = 1,
    private tickMillis = 1000,
  ) {}

  /**
   * Starts the ticker from zero with the given handler and timing options.
   *
   * @param params - Start options containing the tick handler and optional timing overrides.
   * @returns Nothing.
   *
   * @example
   * ticker.start({
   *   handler: (elapsedSec) => {
   *     setElapsed(elapsedSec);
   *   },
   *   intervalSec: 1,
   * });
   */
  start({
    handler,
    intervalSec = 1,
    tickMillis = 1000,
  }: {
    handler: TickerHandler;
    intervalSec?: number;
    tickMillis?: number;
  }) {
    this.intervalSec = intervalSec;
    this.tickMillis = tickMillis;
    this.handler = handler;
    this.reset();
    this.resume();
  }

  /**
   * Resumes ticking from the current accumulated time.
   *
   * @returns Nothing.
   *
   * @example
   * ticker.resume();
   */
  resume() {
    this.status = 'progress';
    this.lastStartedUnixMs = currentUnixMs();
    this.clear = setIntervalWithTimeout(() => {
      this.callHandler();
    }, this.intervalSec * 1000);
  }

  /**
   * Pauses ticking and keeps the accumulated elapsed time.
   *
   * @returns Nothing.
   *
   * @example
   * ticker.pause();
   */
  pause() {
    this.status = 'pause';
    this.accumulatedMs += currentUnixMs() - this.lastStartedUnixMs;
    this.clear?.();
  }

  /**
   * Stops the ticker and resets its accumulated time.
   *
   * @returns Nothing.
   *
   * @example
   * ticker.reset();
   */
  reset() {
    this.accumulatedMs = 0;
    this.lastStartedUnixMs = 0;
    this.clear?.();
    this.status = 'initial';
  }

  private callHandler() {
    const elapsedFromLastStarted = currentUnixMs() - this.lastStartedUnixMs;
    this.handler?.(
      Math.floor((this.accumulatedMs + elapsedFromLastStarted) / (this.tickMillis || 1000)),
    );
  }
}
