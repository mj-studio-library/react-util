# @mj-studio/react-util

A manually maintained reference for the public React utilities in this repository.
Keep it aligned with `index.ts`, implementation behavior, and `llms.txt`.

## Installation

```bash
pnpm add @mj-studio/react-util
```

## Import

```ts
import { useTicker } from '@mj-studio/react-util'
```

## API

### Hook

#### `useMount(callback: EffectCallback): void`
Runs a callback once after the component mounts. The callback return value is ignored.

```tsx
useMount(() => {
  analytics.track('screen_open')
})
```

#### `useIntervalCallback(callback: () => void, intervalSec?: number, doImmediately?: boolean): void`
Runs a callback on a fixed interval and always uses the latest callback reference.

```tsx
useIntervalCallback(() => {
  refreshClock()
}, 1, true)
```

#### `useTimeoutHandlers(): { clearTimerAtUnmount, clearAllTimers, setAutoClearTimeout }`
Returns timeout helpers that automatically clean up tracked timers on unmount.

```tsx
const { setAutoClearTimeout, clearAllTimers } = useTimeoutHandlers()

useMount(() => {
  setAutoClearTimeout(() => {
    setOpen(false)
  }, 3000)
})
```

##### `clearAllTimers()`
Clears every tracked timeout and resets the internal timer list.

##### `clearTimerAtUnmount(id, options?)`
Registers an existing timeout id so it is cleared on unmount. Pass `{ withClear: true }` to clear already tracked timers first.

##### `setAutoClearTimeout(callback, ms, options?)`
Creates a timeout, tracks it automatically, and returns the timeout id.

#### `useStableCallback<T extends Function>(unstableCallback: T): T`
Returns a stable callback reference that always delegates to the latest callback implementation.

```tsx
const onTick = useStableCallback(() => {
  console.log(latestValue)
})
```

#### `useUnmount(callback: EffectCallback): void`
Runs a callback once when the component unmounts. The callback should perform its own cleanup work.

```tsx
useUnmount(() => {
  socket.close()
})
```

#### `useMountBeforeRender(callback: EffectCallback): void`
Runs a callback once during the first render before the component paints. The callback return value is ignored.

```tsx
useMountBeforeRender(() => {
  cacheRef.current = createCache()
})
```

#### `useIsClient(): boolean`
Returns `true` after the component has mounted on the client.

```tsx
const isClient = useIsClient()

return isClient ? <ClientOnlyChart /> : null
```

#### `useEffectWithoutFirst(callback: EffectCallback, deps?: DependencyList): void`
Runs an effect only after the initial render has been skipped. The callback return value is ignored.

```tsx
useEffectWithoutFirst(() => {
  saveDraft(formState)
}, [formState])
```

#### `useLifecycle(): { checkMounted: () => boolean; checkUnmounted: () => boolean }`
Returns predicates for checking whether the component has mounted or already unmounted.

```tsx
const { checkUnmounted } = useLifecycle()

fetchData().then(() => {
  if (!checkUnmounted()) {
    setReady(true)
  }
})
```

#### `useRefValue<T>(init: () => T): T`
Lazily creates a stable value once and keeps it for the component lifetime.

```tsx
const instanceId = useRefValue(() => crypto.randomUUID())
```

#### `useBeforeunloadDom(handler: (e: BeforeUnloadEvent) => string | undefined | void): void`
Subscribes to the browser `beforeunload` event. This hook is browser-only and throws when the required DOM APIs are unavailable.

```tsx
useBeforeunloadDom((event) => {
  if (!hasUnsavedChanges) {
    return
  }

  event.preventDefault()
  return 'You have unsaved changes.'
})
```

### Component

#### `IntervalHandler(props: IntervalHandlerProps)`
Renders the current interval tick through a render prop.

```tsx
<IntervalHandler intervalSec={1} doImmediately={true}>
  {({ tick }) => <span>{tick}</span>}
</IntervalHandler>
```

#### `BeforeunloadDom(props: { onBeforeunload: (e: BeforeUnloadEvent) => string | undefined | void; children?: ReactNode })`
Registers a `beforeunload` listener and renders children unchanged.

```tsx
<BeforeunloadDom onBeforeunload={() => 'You have unsaved changes.'}>
  <Editor />
</BeforeunloadDom>
```

### Ticker

#### `Ticker`
Imperative ticker that emits elapsed time on a fixed interval.

```ts
const ticker = new Ticker()

ticker.start({
  handler: (elapsedSec) => {
    console.log(elapsedSec)
  },
})
```

##### `Ticker.status: TickerStatus`
Current lifecycle state of the ticker. The value is one of `'initial'`, `'pause'`, or `'progress'`.

##### `Ticker.start({ handler, intervalSec, tickMillis })`
Starts the ticker from zero with a handler and optional interval settings.

##### `Ticker.resume()`
Resumes ticking from the current accumulated time.

##### `Ticker.pause()`
Pauses ticking and preserves the accumulated elapsed time.

##### `Ticker.reset()`
Stops the ticker and resets its accumulated time to zero.

#### `useTicker(params?: UseTickerParams)`
Creates ticker state and imperative controls for elapsed time updates.

```tsx
const { tickSec, startTicker, pauseTicker } = useTicker({
  onComplete: () => {
    console.log('done')
  },
})

useMount(() => {
  startTicker({ durationSec: 10 })
})
```

##### `status`
Ticker lifecycle state. The value is one of `'initial'`, `'run_pause'`, `'run_progress'`, or `'complete'`.

##### `tickSec`
Current elapsed time in ticker units.

##### `startTicker({ durationSec, intervalSec, tickMillis })`
Starts the ticker. `durationSec` defaults to a large sentinel value so the ticker can run without an explicit end.

##### `pauseTicker()`
Pauses the active ticker when it is running.

##### `resumeTicker()`
Resumes a paused ticker. If `startAtResumeIfNeeded` is enabled, this can start a fresh ticker from the initial state.

##### `resetTicker()`
Resets the ticker state and clears the elapsed time.

##### `TickerComponent`
Render-prop component that subscribes to ticker updates and renders `{ tickSec }`.

```tsx
<TickerComponent>
  {({ tickSec }) => <span>{tickSec}</span>}
</TickerComponent>
```

#### `useReverseTicker(params?: UseTickerParams)`
Creates ticker controls that count down from a duration instead of counting up from zero.

```tsx
const { tickSec, startTicker } = useReverseTicker({})

useMount(() => {
  startTicker({ durationSec: 30 })
})
```

##### `tickSec`
Remaining time derived from the original duration minus the elapsed ticker time.

##### `startTicker({ durationSec, intervalSec, tickMillis })`
Starts the reverse ticker. Negative durations are ignored.

##### `resetTicker()`
Resets the reverse ticker and clears the stored duration.

#### `useDueDateTicker(params?: DueDateTickerProps)`
Creates countdown text and controls for a target due date.

```tsx
const { dueDateText, startTickerWithISO8601 } = useDueDateTicker({
  secondsFormat: 'mm:ss',
})

useMount(() => {
  startTickerWithISO8601('2030-01-01T00:00:00.000Z')
})
```

##### `dueDateText`
Formatted remaining time text generated with `@mj-studio/js-util` second-format helpers.

##### `tickSec`
Remaining seconds from the target due date.

##### `isExpired`
Whether the target date has already passed or the countdown completed.

##### `startTickerWithUnixSec(targetUnixSec)`
Starts the countdown from a unix timestamp. Thirteen-digit millisecond values are normalized to seconds automatically.

##### `startTickerWithISO8601(iso8601)`
Starts the countdown from an ISO-8601 date string. Invalid strings are ignored.

#### `DueDateText(props: { dueDate: string | number; children: (text: string, meta: { remainSeconds: number; isExpired: boolean }) => ReactElement } & DueDateTickerProps)`
Renders formatted due-date text through a render prop.

```tsx
<DueDateText dueDate={"2030-01-01T00:00:00.000Z"}>
  {(text, { isExpired }) => <span>{isExpired ? 'Expired' : text}</span>}
</DueDateText>
```

### Utility

#### `createCtx<T, P extends object>(delegate, name?): CreatedContext<T, P>`
Creates a React context helper tuple with a required hook, provider, consumer, optional hook, and raw context.

Tuple order:
`[useRequiredContext, Provider, Consumer, useOptionalContext, Context]`

```tsx
const [useAuth, AuthProvider] = createCtx<{ userId: string }, { userId: string }>(
  ({ userId }) => ({ userId }),
  'Auth',
)
```

#### `getSearchParams(value: string[][] | Record<string, string> | string | URLSearchParams): string`
Serializes search params into a query-string fragment without a leading `?`.

```ts
getSearchParams({ page: '1', q: 'react' }) // Returns: 'page=1&q=react'
```

### DOM Utility

#### `copyTextToClipboardDom(text: string): Promise<void>`
Copies text to the system clipboard in a browser runtime.

```ts
await copyTextToClipboardDom('Hello world')
```

#### `copyImageToClipboardDom(dataURI: string): Promise<void>`
Copies an image data URI to the system clipboard in a browser runtime.

```ts
await copyImageToClipboardDom('data:image/png;base64,...')
```

#### `blurFocusDom(): void`
Moves focus away from the currently focused element in a browser runtime.

```ts
blurFocusDom()
```

### Event

#### `AppEvent`
Global in-memory event emitter instance for app-level events.

```ts
AppEvent.emitEvent('toast', { message: 'Saved' })
```

##### `AppEvent.emitEvent(type, payload?)`
Emits an event to every registered listener and returns whether any listener was called.

##### `AppEvent.awaitEmitEvent(type, payload?)`
Emits an event and waits for asynchronous listeners in registration order.

##### `AppEvent.addEventListener(type, listener)`
Registers a listener for the given event type.

##### `AppEvent.removeEventListener(type, listener)`
Removes a previously registered listener from the given event type.

#### `useAppEventListener<T>(type: string, listener: AppEventListener<T>, unsubscribe?: () => void): void`
Subscribes a component to synchronous events from `AppEvent`.

```tsx
useAppEventListener('toast', ({ message }) => {
  console.log(message)
})
```

#### `useAsyncAppEventListener<T>(type: string, listener: AppEventAsyncListener<T>, unsubscribe?: () => void): void`
Subscribes a component to asynchronous events intended for `AppEvent.awaitEmitEvent`.

```tsx
useAsyncAppEventListener('save', async (payload) => {
  await persist(payload)
})
```

### Types

#### `UseTickerParams`
Configuration for `useTicker` and `useReverseTicker`.

- `onComplete?: () => void`
- `startAtResumeIfNeeded?: boolean`
- `disableTickSecUpdate?: boolean`

#### `DueDateTickerProps`
Configuration for `useDueDateTicker` and `DueDateText`.

- `secondsFormat?: SecFormats`

#### `TickerStatus`
Ticker lifecycle state used by `Ticker`.

#### `TickerHandler`
Callback signature used by `Ticker.start`.

#### `IntervalHandlerProps`
Render-prop component props used by `IntervalHandler`.

#### `ChildrenTransformer`
Callback used by `createCtx` to transform provider children before render.

#### `CreatedContext<T, P>`
Readonly tuple returned by `createCtx`.

#### `AppEventListener<T>`
Synchronous listener signature used by `AppEvent`.

#### `AppEventAsyncListener<T>`
Asynchronous listener signature used by `AppEvent.awaitEmitEvent`.
