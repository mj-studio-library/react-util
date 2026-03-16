import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEffectWithoutFirst } from './useEffectWithoutFirst';
import { useIsClient } from './useIsClient';
import { useLifecycle } from './useLifecycle';
import { useMount } from './useMount';
import { useMountBeforeRender } from './useMountBeforeRender';
import { useRefValue } from './useRefValue';
import { useStableCallback } from './useStableCallback';
import { useUnmount } from './useUnmount';

describe('basic hooks', () => {
  it('runs useMount callbacks once on mount', () => {
    const callback = vi.fn();

    renderHook(() => useMount(callback));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('runs the latest useUnmount callback on unmount', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ callback }: { callback: () => void }) => useUnmount(callback),
      { initialProps: { callback: first } },
    );

    rerender({ callback: second });
    unmount();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('skips the first effect run in useEffectWithoutFirst', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }: { value: number }) => useEffectWithoutFirst(callback, [value]),
      { initialProps: { value: 0 } },
    );

    expect(callback).not.toHaveBeenCalled();

    rerender({ value: 1 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('reports a client render from useIsClient', () => {
    const { result } = renderHook(() => useIsClient());

    expect(result.current).toBe(true);
  });

  it('tracks mount and unmount state in useLifecycle', () => {
    const { result, unmount } = renderHook(() => useLifecycle());
    const { checkMounted, checkUnmounted } = result.current;

    expect(checkMounted()).toBe(true);
    expect(checkUnmounted()).toBe(false);

    unmount();

    expect(checkUnmounted()).toBe(true);
  });

  it('calls useMountBeforeRender only once across rerenders', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ value }: { value: number }) => {
        useMountBeforeRender(callback);

        return value;
      },
      { initialProps: { value: 1 } },
    );

    rerender({ value: 2 });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('initializes useRefValue once and preserves the instance', () => {
    const init = vi.fn(() => ({ value: 1 }));
    const { result, rerender } = renderHook(() => useRefValue(init));
    const first = result.current;

    rerender();

    expect(init).toHaveBeenCalledTimes(1);
    expect(result.current).toBe(first);
  });

  it('keeps useStableCallback identity while using the latest closure', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: number }) => useStableCallback(() => value),
      { initialProps: { value: 1 } },
    );
    const firstCallback = result.current;

    rerender({ value: 2 });

    expect(result.current).toBe(firstCallback);
    expect(result.current()).toBe(2);
  });
});
