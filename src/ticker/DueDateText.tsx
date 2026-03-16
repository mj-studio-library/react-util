import type { ReactElement } from 'react';
import { useEffect } from 'react';
import { is } from '@mj-studio/js-util';

import type { DueDateTickerProps } from './useDueDateTicker';
import { useDueDateTicker } from './useDueDateTicker';

type Props = {
  dueDate: string | number;
  children: (text: string, meta: { remainSeconds: number; isExpired: boolean }) => ReactElement;
} & DueDateTickerProps;

/**
 * Renders formatted due-date text through a render prop.
 *
 * String values are treated as ISO-8601 timestamps. Number values are treated as unix
 * seconds, and 13-digit millisecond values are normalized automatically.
 *
 * @param props - Due date input, optional formatting options, and a render prop.
 * @returns The result of the `children` render prop.
 *
 * @example
 * <DueDateText dueDate={"2030-01-01T00:00:00.000Z"}>
 *   {(text, { isExpired }) => <span>{isExpired ? 'Expired' : text}</span>}
 * </DueDateText>
 */
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
