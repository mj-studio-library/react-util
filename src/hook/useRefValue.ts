import { useState } from 'react';

/**
 * Lazily creates a stable value once and keeps it for the component lifetime.
 *
 * @param init - Factory called once to create the initial value.
 * @returns The stable value created by `init`.
 *
 * @example
 * const instanceId = useRefValue(() => crypto.randomUUID());
 */
export function useRefValue<T>(init: () => T): T {
  const [ref] = useState(() => init());

  return ref;
}
