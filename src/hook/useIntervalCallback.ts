import { useEffect, useRef } from 'react';
import { setIntervalWithTimeout } from '@mj-studio/js-util';

import { useMount } from './useMount';

export function useIntervalCallback(
  callback: () => void,
  intervalSec = 1,
  doImmediately: boolean = false,
) {
  const ref = useRef<Function>();
  ref.current = callback;

  useMount(() => {
    if (doImmediately) {
      ref.current?.();
    }
  });

  useEffect(() => {
    return setIntervalWithTimeout(() => ref.current?.(), intervalSec * 1000);
  }, [intervalSec]);
}
