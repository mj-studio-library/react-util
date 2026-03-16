import type { ReactNode } from 'react';
import { useState } from 'react';

import { useIntervalCallback } from '../hook/useIntervalCallback';

/**
 * Props for `IntervalHandler`.
 */
type IntervalHandlerProps = {
  children?: (params: { tick: number }) => ReactNode;
  intervalSec?: number;
  doImmediately?: boolean;
};

/**
 * Renders the current interval tick through a render prop.
 *
 * @param props - Optional interval settings and a render prop that receives `tick`.
 * @returns The result of the `children` render prop, if provided.
 *
 * @example
 * <IntervalHandler intervalSec={1} doImmediately={true}>
 *   {({ tick }) => <span>{tick}</span>}
 * </IntervalHandler>
 */
const IntervalHandler = ({
  children,
  intervalSec = 1,
  doImmediately = false,
}: IntervalHandlerProps) => {
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

export { IntervalHandler, IntervalHandlerProps };
