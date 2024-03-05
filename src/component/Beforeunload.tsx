import type { PropsWithChildren } from 'react';

import { useBeforeunload } from '../hook/useBeforeunload';

export const Beforeunload = ({
  children = null,
  onBeforeunload,
}: PropsWithChildren<{
  onBeforeunload: (e: BeforeUnloadEvent) => any;
}>) => {
  useBeforeunload(onBeforeunload);

  return children;
};
