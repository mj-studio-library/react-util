import { useCallback, useRef } from 'react';

import { useMount } from './useMount';
import { useUnmount } from './useUnmount';

/**
 * Tracks whether a component has mounted or unmounted.
 *
 * @returns An object with two predicates:
 * `checkMounted()` returns whether the component has mounted, and
 * `checkUnmounted()` returns whether the component has already unmounted.
 *
 * @example
 * const { checkUnmounted } = useLifecycle();
 *
 * fetchData().then(() => {
 *   if (!checkUnmounted()) {
 *     setReady(true);
 *   }
 * });
 */
export function useLifecycle() {
  const isMounted = useRef(false);
  const isUnmounted = useRef(false);

  useMount(() => {
    isMounted.current = true;
  });

  useUnmount(() => {
    isUnmounted.current = true;
  });

  const checkMounted = useCallback(() => {
    return isMounted.current;
  }, []);

  const checkUnmounted = useCallback(() => {
    return isUnmounted.current;
  }, []);

  return {
    checkMounted,
    checkUnmounted,
  };
}
