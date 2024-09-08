import type { EffectCallback } from 'react';
import { useRef } from 'react';

/**
 * This is a kind of react hooks for initial configuration in Functional React Component
 * It isn't equivalent with componentDidMount() in class React Component
 *
 * @param callback function will be invoked directly
 * @author MJ
 */
const useInitMount = (callback: EffectCallback): void => {
  const isCalled = useRef(false);
  if (!isCalled.current) {
    callback();
    isCalled.current = true;
  }
};

export { useInitMount };
