import { useCallback, useRef } from 'react';

import { useMount } from './useMount';
import { useUnmount } from './useUnmount';

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
