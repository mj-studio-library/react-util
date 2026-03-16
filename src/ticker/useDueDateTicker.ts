import { useCallback, useState } from 'react';
import type { SecFormats } from '@mj-studio/js-util';
import { formatSec, SecFormat } from '@mj-studio/js-util';

import { useReverseTicker } from './useReverseTicker';

function convertMilliSecondsToSeconds(timestamp: number) {
  if (timestamp.toString().length >= 13) {
    return Math.floor(timestamp / 1000);
  }

  return timestamp;
}

/**
 * Options for formatting the countdown text returned by `useDueDateTicker`.
 */
export type DueDateTickerProps = {
  secondsFormat?: SecFormats;
};

/**
 * Creates countdown text and controls for a target due date.
 *
 * @param params - Optional formatting options for the rendered remaining time text.
 * @returns An object with countdown state and controls:
 * `dueDateText`, `tickSec`, `isExpired`, `startTickerWithUnixSec(...)`,
 * and `startTickerWithISO8601(...)`.
 *
 * @example
 * const { dueDateText, startTickerWithISO8601 } = useDueDateTicker({
 *   secondsFormat: 'mm:ss',
 * });
 *
 * useMount(() => {
 *   startTickerWithISO8601('2030-01-01T00:00:00.000Z');
 * });
 */
export function useDueDateTicker({
  secondsFormat = 'hh:mm:ss_on_demand',
}: DueDateTickerProps = {}) {
  const [isExpired, setExpired] = useState(false);
  const { startTicker: _startTicker, tickSec, status } = useReverseTicker({});

  const startTickerWithUnixSec = useCallback(
    (targetUnixSec: number) => {
      targetUnixSec = convertMilliSecondsToSeconds(targetUnixSec);

      const durationSec = targetUnixSec - Math.floor(Date.now() / 1000);
      if (durationSec < 0) {
        setExpired(true);
      } else {
        _startTicker({
          durationSec,
          intervalSec: SecFormat.invalidateIntervalSec(secondsFormat),
        });
      }
    },
    [_startTicker, secondsFormat],
  );

  const startTickerWithISO8601 = useCallback(
    (iso8601: string) => {
      const unixMs = Date.parse(iso8601);
      if (isNaN(unixMs)) {
        return;
      }

      startTickerWithUnixSec(Math.floor(unixMs / 1000));
    },
    [startTickerWithUnixSec],
  );

  return {
    dueDateText: formatSec(tickSec, secondsFormat),
    startTickerWithUnixSec,
    startTickerWithISO8601,
    isExpired: isExpired || status === 'complete',
    tickSec,
  };
}
