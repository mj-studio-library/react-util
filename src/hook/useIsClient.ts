'use client';

import { useState } from 'react';

import { useMount } from './useMount';

export function useIsClient() {
  const [value, setValue] = useState(false);
  useMount(() => setValue(true));

  return value;
}
