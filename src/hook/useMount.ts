import type { EffectCallback } from 'react';
import { useEffect } from 'react';

/**
 * This is a kind of react hooks for initial configuration in Functional React Component
 * It is equivalent with componentDidMount() in class React Component
 * This hooks doesn't accept function returning function like useEffect for preventing re-invoke during componentWillUnmount
 *
 * @param callback function will be invoked during componentDidMount
 * @author MJ
 */
const useMount = (callback: EffectCallback): void => {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export { useMount };
