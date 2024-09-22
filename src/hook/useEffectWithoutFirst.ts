import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

const useEffectWithoutFirst = (callback: EffectCallback, deps?: DependencyList): void => {
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;

      return;
    }

    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export { useEffectWithoutFirst };
