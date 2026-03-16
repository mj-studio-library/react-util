import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BeforeunloadDom } from './Beforeunload';
import { Condition } from './Condition';
import { IntervalHandler } from './IntervalHandler';

describe('components', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('wraps children only when Condition receives true', () => {
    function Wrapper({ children }: React.PropsWithChildren) {
      return <section data-testid="wrapper">{children}</section>;
    }

    const { rerender } = render(
      <Condition Component={Wrapper} condition={true}>
        <span>child</span>
      </Condition>,
    );

    expect(screen.getByTestId('wrapper').textContent).toBe('child');

    rerender(
      <Condition Component={Wrapper} condition={false}>
        <span>child</span>
      </Condition>,
    );

    expect(screen.queryByTestId('wrapper')).toBeNull();
    expect(screen.getByText('child')).toBeTruthy();
  });

  it('renders BeforeunloadDom children', () => {
    render(
      <BeforeunloadDom onBeforeunload={() => undefined}>
        <span>content</span>
      </BeforeunloadDom>,
    );

    expect(screen.getByText('content')).toBeTruthy();
  });

  it('increments IntervalHandler tick over time', () => {
    render(
      <IntervalHandler intervalSec={1}>
        {({ tick }) => <div data-testid="tick">{tick}</div>}
      </IntervalHandler>,
    );

    expect(screen.getByTestId('tick').textContent).toBe('0');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByTestId('tick').textContent).toBe('1');
  });
});
