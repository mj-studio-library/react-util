import { useCallback, useState } from 'react';

import type { UseTickerParams } from './useTicker';
import { useTicker } from './useTicker';

export function useReverseTicker(params: UseTickerParams) {
  const {
    startTicker: _startTicker,
    tickSec: _tickSec,
    resetTicker: _resetTicker,
    ...rest
  } = useTicker(params);

  const [duration, setDuration] = useState(0);

  const startTicker = useCallback(
    ({
      durationSec,
      intervalSec,
      tickMillis,
    }: {
      durationSec: number;
      intervalSec?: number;
      tickMillis?: number;
    }) => {
      if (durationSec >= 0) {
        setDuration(durationSec);
        _startTicker({ durationSec, intervalSec, tickMillis });
      }
    },
    [_startTicker],
  );

  const resetTicker = useCallback(() => {
    _resetTicker();
    setDuration(0);
  }, [_resetTicker]);

  return {
    startTicker,
    resetTicker,
    tickSec: duration - _tickSec,
    ...rest,
  };
}
