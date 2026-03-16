import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useDueDateTickerMock = vi.fn();

vi.mock('./useDueDateTicker', () => {
  return {
    useDueDateTicker: () => useDueDateTickerMock(),
  };
});

import { DueDateText } from './DueDateText';

describe('DueDateText', () => {
  beforeEach(() => {
    useDueDateTickerMock.mockReset();
  });

  it('starts the ISO ticker for string due dates and renders hook output', () => {
    const startTickerWithISO8601 = vi.fn();
    const startTickerWithUnixSec = vi.fn();

    useDueDateTickerMock.mockReturnValue({
      dueDateText: '00:00:03',
      startTickerWithISO8601,
      startTickerWithUnixSec,
      tickSec: 3,
      isExpired: false,
    });

    render(
      <DueDateText dueDate="2026-01-01T00:00:03.000Z">
        {(text, meta) => (
          <div data-testid="value">
            {text}-{meta.remainSeconds}-{String(meta.isExpired)}
          </div>
        )}
      </DueDateText>,
    );

    expect(startTickerWithISO8601).toHaveBeenCalledWith('2026-01-01T00:00:03.000Z');
    expect(startTickerWithUnixSec).not.toHaveBeenCalled();
    expect(screen.getByTestId('value').textContent).toBe('00:00:03-3-false');
  });

  it('starts the unix ticker for numeric due dates', () => {
    const startTickerWithISO8601 = vi.fn();
    const startTickerWithUnixSec = vi.fn();

    useDueDateTickerMock.mockReturnValue({
      dueDateText: '00:00:05',
      startTickerWithISO8601,
      startTickerWithUnixSec,
      tickSec: 5,
      isExpired: false,
    });

    render(
      <DueDateText dueDate={5}>{(text) => <div data-testid="value">{text}</div>}</DueDateText>,
    );

    expect(startTickerWithUnixSec).toHaveBeenCalledWith(5);
    expect(startTickerWithISO8601).not.toHaveBeenCalled();
    expect(screen.getByTestId('value').textContent).toBe('00:00:05');
  });
});
