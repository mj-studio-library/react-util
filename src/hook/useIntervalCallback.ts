import { useEffect, useRef } from 'react';
import { setIntervalWithTimeout } from '@mj-studio/js-util';

import { useMount } from './useMount';

/**
 * Runs a callback on an interval and keeps the latest callback reference.
 *
 * @param callback - Callback invoked on every interval tick.
 * @param intervalSec - Interval in seconds between callback calls.
 * @param doImmediately - Whether to invoke the callback once immediately after mount.
 * @returns Nothing.
 *
 * @example
 * useIntervalCallback(() => {
 *   refreshClock();
 * }, 1, true)
 */
export function useIntervalCallback(
  callback: () => void,
  intervalSec = 1,
  doImmediately: boolean = false,
) {
  const ref = useRef<Function>();
  ref.current = callback;

  useMount(() => {
    if (doImmediately) {
      ref.current?.();
    }
  });

  useEffect(() => {
    return setIntervalWithTimeout(() => ref.current?.(), intervalSec * 1000);
  }, [intervalSec]);
}
