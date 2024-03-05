import type { PropsWithChildren } from 'react';

import { useBeforeunload } from '../hook/useBeforeunload';

export const Beforeunload = ({
  children = null,
  onBeforeunload,
}: PropsWithChildren<{
  onBeforeunload: (e: BeforeUnloadEvent) => string | undefined | void;
}>) => {
  useBeforeunload(onBeforeunload);

  return children;
};
