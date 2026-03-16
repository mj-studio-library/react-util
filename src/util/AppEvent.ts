import { useCallback, useEffect, useRef } from 'react';

/**
 * Synchronous listener signature used by `AppEvent`.
 */
export type AppEventListener<T> = (payload: T) => void;

/**
 * Asynchronous listener signature used by `AppEvent.awaitEmitEvent`.
 */
export type AppEventAsyncListener<T> = (payload: T) => Promise<void>;

type EventType = string;

/**
 * In-memory event emitter used by the exported `AppEvent` singleton.
 */
class AppEvent {
  #listenerMap = new Map<EventType, (AppEventListener<any> | AppEventAsyncListener<any>)[]>();

  /**
   * Emits an event to every registered listener.
   *
   * @param type - Event name to emit.
   * @param payload - Optional event payload passed to listeners.
   * @returns `true` when at least one listener was invoked, otherwise `false`.
   */
  emitEvent<Payload>(type: EventType, payload?: Payload): boolean {
    let anyListener = false;
    this.#listenerMap.get(type)?.forEach((listener) => {
      anyListener = true;
      listener(payload);
    });

    return anyListener;
  }

  /**
   * Emits an event and waits for asynchronous listeners in registration order.
   *
   * @param type - Event name to emit.
   * @param payload - Optional event payload passed to listeners.
   * @returns A promise that resolves after all listeners finish.
   */
  async awaitEmitEvent<Payload>(type: EventType, payload?: Payload): Promise<void> {
    const listeners = this.#listenerMap.get(type) || [];
    for (let i = 0; i < listeners.length; i++) {
      await listeners[i](payload);
    }
  }

  /**
   * Registers a listener for the given event type.
   *
   * @param type - Event name to subscribe to.
   * @param listener - Listener to store.
   * @returns Nothing.
   */
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

  /**
   * Removes a previously registered listener from the given event type.
   *
   * @param type - Event name to unsubscribe from.
   * @param listener - Listener to remove.
   * @returns Nothing.
   */
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

/**
 * Global event emitter instance for app-level in-memory events.
 *
 * @example
 * AppEvent.emitEvent('toast', { message: 'Saved' });
 */
const appEventInstance = new AppEvent();

/**
 * Subscribes a component to synchronous events from `AppEvent`.
 *
 * The listener is registered on mount and removed on unmount. If `unsubscribe` is
 * provided, it is also called during cleanup before the listener is removed.
 *
 * @param type - Event name to subscribe to.
 * @param listener - Listener invoked when the event is emitted.
 * @param unsubscribe - Optional cleanup callback invoked during unmount.
 * @returns Nothing.
 *
 * @example
 * useAppEventListener('toast', ({ message }) => {
 *   console.log(message);
 * });
 */
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
 * Subscribes a component to asynchronous events intended for `AppEvent.awaitEmitEvent`.
 *
 * @param type - Event name to subscribe to.
 * @param listener - Async listener invoked when the event is emitted.
 * @param unsubscribe - Optional cleanup callback invoked during unmount.
 * @returns Nothing.
 *
 * @example
 * useAsyncAppEventListener('save', async (payload) => {
 *   await persist(payload);
 * });
 */
const useAsyncAppEventListener = <T>(
  type: EventType,
  listener: AppEventAsyncListener<T>,
  unsubscribe?: () => void,
) => {
  useAppEventListener(type, listener, unsubscribe);
};

export { appEventInstance as AppEvent, useAppEventListener, useAsyncAppEventListener };
