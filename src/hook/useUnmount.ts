import type { EffectCallback } from 'react';
import { useEffect, useRef } from 'react';

/**
 * This is a kind of react hooks for cleanup resources when useEffect clean up phase like componentWillUnmount.
 *
 * @param callback function will be invoked during componentWillUnmount.
 * @see useComponentDidMount
 * @author MJ
 */
const useUnmount = (callback: EffectCallback) => {
  const callbackRef = useRef<() => void>();
  callbackRef.current = callback;
  useEffect(() => {
    return () => {
      callbackRef.current?.();
    };
  }, []);
};

export { useUnmount };
