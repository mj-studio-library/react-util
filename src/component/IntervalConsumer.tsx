import type { ReactNode } from 'react';
import { useState } from 'react';

import { useIntervalCallback } from '../hook/useIntervalCallback';

export type IntervalConsumerProps = {
  children?: (params: { tick: number }) => ReactNode;
  intervalSec?: number;
  doImmediately?: boolean;
};

const IntervalConsumer = ({
  children,
  intervalSec = 1,
  doImmediately = false,
}: IntervalConsumerProps) => {
  const [tick, setTick] = useState(0);
  useIntervalCallback(
    () => {
      setTick((t) => t + 1);
    },
    intervalSec,
    doImmediately,
  );

  return children?.({ tick });
};

export default IntervalConsumer;