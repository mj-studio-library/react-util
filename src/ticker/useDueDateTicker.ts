import { useCallback, useState } from 'react';
import type { SecFormats } from '@mj-studio/js-util';
import { formatSec, SecFormat } from '@mj-studio/js-util';

import { useReverseTicker } from './useReverseTicker';

export type DueDateTickerProps = {
  secondsFormat?: SecFormats;
};
export function useDueDateTicker({
  secondsFormat = 'hh:mm:ss_on_demand',
}: DueDateTickerProps = {}) {
  const [isExpired, setExpired] = useState(false);
  const { startTicker: _startTicker, tickSec, status } = useReverseTicker({});

  const startTickerWithUnixSec = useCallback(
    (targetUnixSec: number) => {
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
