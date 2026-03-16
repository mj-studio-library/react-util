import { useRef } from 'react';

import { useStableCallback } from './useStableCallback';
import { useUnmount } from './useUnmount';

/**
 * Returns helpers for registering and clearing timeouts tied to the component lifecycle.
 *
 * @returns An object with timer controls:
 * `clearAllTimers()` clears every tracked timeout,
 * `clearTimerAtUnmount(id, options)` tracks an existing timer id for cleanup, and
 * `setAutoClearTimeout(callback, ms, options)` creates and tracks a timeout automatically.
 *
 * @example
 * const { setAutoClearTimeout } = useTimeoutHandlers();
 *
 * useMount(() => {
 *   setAutoClearTimeout(() => {
 *     setOpen(false);
 *   }, 3000);
 * });
 */
export function useTimeoutHandlers() {
  const handler = useRef<number[]>([]);

  useUnmount(() => {
    handler.current.forEach(clearTimeout);
  });

  const clearAllTimers = useStableCallback(() => {
    handler.current.forEach(clearTimeout);
    handler.current = [];
  });

  const clearTimerAtUnmount = useStableCallback(
    (id: any, { withClear }: { withClear?: boolean } = { withClear: false }) => {
      if (withClear) {
        clearAllTimers();
      }

      handler.current.push(id);

      return id;
    },
  );

  const setAutoClearTimeout = useStableCallback(
    (
      callback: () => void,
      ms: number,
      { withClear }: { withClear?: boolean } = { withClear: false },
    ) => {
      if (withClear) {
        clearAllTimers();
      }

      return clearTimerAtUnmount(setTimeout(callback, ms));
    },
  );

  return { clearTimerAtUnmount, clearAllTimers, setAutoClearTimeout };
}
