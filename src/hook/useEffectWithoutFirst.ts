import type { DependencyList, EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * Runs an effect only after the first render has been skipped.
 *
 * The callback return value is ignored and is not used as an effect cleanup.
 *
 * @param callback - Effect callback invoked on dependency updates after the initial render.
 * @param deps - Dependency list that controls when the callback runs.
 * @returns Nothing.
 *
 * @example
 * useEffectWithoutFirst(() => {
 *   saveDraft(formState);
 * }, [formState])
 */
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
