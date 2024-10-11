import type { ComponentType, PropsWithChildren } from 'react';

export function Condition({
  condition,
  Component,
  children,
}: PropsWithChildren<{ condition: boolean; Component: ComponentType<any> }>) {
  return condition ? <Component>{children}</Component> : children;
}
