'use client';

import type { Context, ReactElement, ReactNode } from 'react';
import React, { createElement } from 'react';

/**
 * Transforms provider children before they are rendered.
 */
export type ChildrenTransformer = (children?: ReactNode) => ReactNode | undefined;

/**
 * Tuple returned by `createCtx`.
 *
 * The order is:
 * `[useRequiredContext, Provider, Consumer, useOptionalContext, Context]`.
 */
export type CreatedContext<T, P> = readonly [
  () => T,
  (props: { children?: ReactNode } & P) => ReactElement,
  React.Consumer<T>,
  () => T | undefined,
  Context<T | undefined>,
];

/**
 * Creates a React context with a required hook, provider, consumer, and optional hook.
 *
 * @param delegate - Creates the context value from provider props and may transform children.
 * @param name - Optional context name used in the required-hook error message.
 * @returns A readonly tuple in the order
 * `[useRequiredContext, Provider, Consumer, useOptionalContext, Context]`.
 *
 * @example
 * const [useAuth, AuthProvider] = createCtx<{ userId: string }, { userId: string }>(
 *   ({ userId }) => ({ userId }),
 *   'Auth',
 * );
 */
export function createCtx<T, P extends object>(
  delegate: (props: P, transformChildren: (transformer: ChildrenTransformer) => void) => T,
  name = '',
): CreatedContext<T, P> {
  const context = React.createContext<T | undefined>(undefined);

  return [
    (): T => {
      const c = React.useContext(context);
      if (!c) {
        throw new Error(`useContext is called outside from ${name ?? '{{Name}}'}Provider context.`);
      }

      return c;
    },
    ({ children: _children, ...props }: { children?: ReactNode } & P): ReactElement => {
      let children = _children;
      const value = delegate(props as P, (transformer) => {
        children = transformer(children);
      });

      return createElement(context.Provider, { value }, children);
    },
    context.Consumer as React.Consumer<T>,
    (): T | undefined => {
      return React.useContext(context);
    },
    context,
  ] as const;
}
