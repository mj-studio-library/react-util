import { useState } from 'react';

import { useMount } from './useMount';

/**
 * Returns whether the component has already mounted in the browser.
 *
 * This starts as `false` during the first render and flips to `true` after mount.
 *
 * @returns `true` after the component mounts on the client, otherwise `false`.
 *
 * @example
 * const isClient = useIsClient();
 *
 * return isClient ? <ClientOnlyChart /> : null;
 */
export function useIsClient() {
  const [value, setValue] = useState(false);
  useMount(() => setValue(true));

  return value;
}
