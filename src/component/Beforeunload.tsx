import type { PropsWithChildren } from 'react';

import { useBeforeunloadDom } from '../hook/useBeforeunload';

export const BeforeunloadDom = ({
  children = null,
  onBeforeunload,
}: PropsWithChildren<{
  onBeforeunload: (e: BeforeUnloadEvent) => string | undefined | void;
}>) => {
  useBeforeunloadDom(onBeforeunload);

  return children;
};
