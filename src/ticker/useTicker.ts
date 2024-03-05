import type { ReactElement } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useLifecycle } from '../hook/useLifecycle';
import { useStableCallback } from '../hook/useStableCallback';
import { useUnmount } from '../hook/useUnmount';

import { Ticker } from './Ticker';

type Status = 'initial' | 'run_pause' | 'run_progress' | 'complete';

export type UseTickerParams = {
  onComplete?: () => void;
  startAtResumeIfNeeded?: boolean;
  disableTickSecUpdate?: boolean;
};
const inf = Number.MAX_SAFE_INTEGER;
export function useTicker({
  onComplete,
  startAtResumeIfNeeded,
  disableTickSecUpdate,
}: UseTickerParams = {}) {
  const { checkUnmounted } = useLifecycle();

  const onCompleteRef = useRef<Function>();
  onCompleteRef.current = onComplete;

  const [status, setStatus] = useState<Status>('initial');
  const ticker = useRef<Ticker>(new Ticker()).current;

  const tickSecListeners = useRef<((tickSec: number) => void)[]>([]);
  const [tickSec, _setTickSec] = useState(0);
  const propagateTickSec = useStableCallback((tickSec: number) => {
    if (!disableTickSecUpdate) {
      _setTickSec(tickSec);
    }

    tickSecListeners.current?.forEach((listener) => listener(tickSec));
  });

  const resetTicker = useStableCallback(() => {
    if (!checkUnmounted()) {
      setStatus('initial');
      propagateTickSec(0);
    }

    ticker.reset();
  });

  const startTicker = useStableCallback(
    (
      {
        durationSec = inf,
        intervalSec,
        tickMillis,
      }: { durationSec?: number; intervalSec?: number; tickMillis?: number } = { durationSec: inf },
    ) => {
      resetTicker();

      setStatus('run_progress');
      ticker.start({
        handler: (tickSec) => {
          propagateTickSec(tickSec);
          if (tickSec >= durationSec) {
            setStatus('complete');
            ticker.reset();
            onCompleteRef.current?.();
          } else {
            setStatus('run_progress');
          }
        },
        intervalSec,
        tickMillis,
      });
    },
  );

  const pauseTicker = useStableCallback(() => {
    if (status !== 'run_progress') {
      return;
    }

    setStatus('run_pause');
    ticker.pause();
  });

  const resumeTicker = useStableCallback(() => {
    if (status === 'initial' && startAtResumeIfNeeded) {
      startTicker();
    } else if (status !== 'run_pause') {
      return;
    } else {
      setStatus('run_progress');
      ticker.resume();
    }
  });

  const TickerComponent = useMemo(
    () =>
      ({
        children,
        initialTickSec,
      }: {
        children: ({ tickSec }: { tickSec: number }) => ReactElement | null | undefined;
        initialTickSec?: number;
      }) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [tick, setTick] = useState(initialTickSec ?? 0);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const listener = useMemo(() => setTick, []);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          tickSecListeners.current.push(listener);

          return () => {
            tickSecListeners.current = tickSecListeners.current.filter((fn) => fn !== listener);
          };
        }, [listener]);

        return children({ tickSec: tick });
      },
    [],
  );

  useUnmount(() => {
    resetTicker();
  });

  return {
    status,
    startTicker,
    tickSec,
    resetTicker,
    pauseTicker,
    resumeTicker,
    TickerComponent,
  };
}
