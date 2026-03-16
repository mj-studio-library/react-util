import type { PropsWithChildren } from 'react';

import { useBeforeunloadDom } from '../hook/useBeforeunload';

/**
 * Registers a `beforeunload` listener and renders children unchanged.
 *
 * This component is browser-only and inherits the same runtime requirements as
 * `useBeforeunloadDom`.
 *
 * @param props - Children and the `beforeunload` handler to register.
 * @returns The provided children.
 *
 * @example
 * <BeforeunloadDom onBeforeunload={() => 'You have unsaved changes.'}>
 *   <Editor />
 * </BeforeunloadDom>
 */
export const BeforeunloadDom = ({
  children = null,
  onBeforeunload,
}: PropsWithChildren<{
  onBeforeunload: (e: BeforeUnloadEvent) => string | undefined | void;
}>) => {
  useBeforeunloadDom(onBeforeunload);

  return children;
};
