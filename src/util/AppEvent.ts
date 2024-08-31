import { useCallback, useEffect, useRef } from 'react';

export type AppEventListener<T> = (payload: T) => void;
export type AppEventAsyncListener<T> = (payload: T) => Promise<void>;

type EventType = string;

class AppEvent {
  #listenerMap = new Map<EventType, (AppEventListener<any> | AppEventAsyncListener<any>)[]>();

  emitEvent<Payload>(type: EventType, payload?: Payload): boolean {
    let anyListener = false;
    this.#listenerMap.get(type)?.forEach((listener) => {
      anyListener = true;
      listener(payload);
    });

    return anyListener;
  }

  async awaitEmitEvent<Payload>(type: EventType, payload?: Payload): Promise<void> {
    const listeners = this.#listenerMap.get(type) || [];
    for (let i = 0; i < listeners.length; i++) {
      await listeners[i](payload);
    }
  }

  addEventListener<Payload>(
    type: EventType,
    listener: AppEventListener<Payload> | AppEventAsyncListener<Payload>,
  ) {
    const currentList = this.#listenerMap.get(type);
    if (!currentList) {
      this.#listenerMap.set(type, [listener]);
    } else {
      currentList.push(listener);
    }
  }

  removeEventListener<Payload>(
    type: EventType,
    listener: AppEventListener<Payload> | AppEventAsyncListener<Payload>,
  ) {
    const currentList = this.#listenerMap.get(type);
    if (currentList) {
      this.#listenerMap.set(
        type,
        currentList.filter((l) => l !== listener),
      );
    }
  }
}

const appEventInstance = new AppEvent();

const useAppEventListener = <T>(
  type: EventType,
  listener: AppEventListener<T>,
  unsubscribe?: () => void,
) => {
  const listenerRef = useRef<AppEventListener<any> | null>(null);
  const unsubscribeRef = useRef<() => void>();

  listenerRef.current = listener;
  unsubscribeRef.current = unsubscribe;

  const listenerCallback = useCallback((payload: any) => listenerRef.current?.(payload), []);

  useEffect(() => {
    appEventInstance.addEventListener(type, listenerCallback);

    return () => {
      unsubscribeRef.current?.();
      appEventInstance.removeEventListener(type, listenerCallback);
    };
  }, [type, listenerCallback]);
};

/**
 * Event Emitter will wait the result of the listeners.
 */
const useAsyncAppEventListener = <T>(
  type: EventType,
  listener: AppEventAsyncListener<T>,
  unsubscribe?: () => void,
) => {
  useAppEventListener(type, listener, unsubscribe);
};

export { appEventInstance as AppEvent, useAppEventListener, useAsyncAppEventListener };
