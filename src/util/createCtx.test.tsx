import React from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { createCtx } from './createCtx';

describe('createCtx', () => {
  it('provides the created context value to hooks and consumers', () => {
    const [useValue, Provider, Consumer, useOptionalValue] = createCtx<
      { value: string },
      { value: string }
    >(({ value }) => ({ value }), 'Example');

    function ConsumerComponent() {
      const required = useValue();
      const optional = useOptionalValue();

      return (
        <>
          <div data-testid="required">{required.value}</div>
          <div data-testid="optional">{optional?.value}</div>
          <Consumer>{(value) => <div data-testid="consumer">{value.value}</div>}</Consumer>
        </>
      );
    }

    render(
      <Provider value="ready">
        <ConsumerComponent />
      </Provider>,
    );

    expect(screen.getByTestId('required').textContent).toBe('ready');
    expect(screen.getByTestId('optional').textContent).toBe('ready');
    expect(screen.getByTestId('consumer').textContent).toBe('ready');
  });

  it('allows the provider delegate to transform children', () => {
    const [, Provider] = createCtx<{ value: string }, { value: string }>(
      ({ value }, transformChildren) => {
        transformChildren((children) => <section data-testid="wrapped">{children}</section>);

        return { value };
      },
      'Transformer',
    );

    render(
      <Provider value="ok">
        <span>child</span>
      </Provider>,
    );

    expect(screen.getByTestId('wrapped').textContent).toBe('child');
  });

  it('throws when the required hook is used outside the provider', () => {
    const [useValue] = createCtx<{ value: string }, { value: string }>(
      ({ value }) => ({ value }),
      'Example',
    );

    function Harness() {
      useValue();

      return null;
    }

    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderToString(<Harness />)).toThrow(
      'useContext is called outside from ExampleProvider context.',
    );
  });
});
