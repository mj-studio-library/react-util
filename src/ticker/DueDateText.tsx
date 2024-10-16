import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { is } from '@mj-studio/js-util';

import type { DueDateTickerProps } from './useDueDateTicker';
import { useDueDateTicker } from './useDueDateTicker';

type Props = {
  dueDate: string | number;
  children: (text: string, meta: { remainSeconds: number; isExpired: boolean }) => ReactElement;
} & DueDateTickerProps;

export const DueDateText = ({ dueDate, children, ...options }: Props) => {
  const { dueDateText, startTickerWithISO8601, startTickerWithUnixSec, tickSec, isExpired } =
    useDueDateTicker({
      ...options,
    });

  useEffect(() => {
    if (is.string(dueDate)) {
      startTickerWithISO8601(dueDate);
    } else {
      startTickerWithUnixSec(dueDate);
    }
  }, [dueDate, startTickerWithISO8601, startTickerWithUnixSec]);

  return children(dueDateText, { isExpired, remainSeconds: tickSec });
};
