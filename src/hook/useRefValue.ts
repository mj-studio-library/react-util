import { useState } from 'react';

export function useRefValue<T>(init: () => T): T {
  const [ref] = useState(() => init());

  return ref;
}
