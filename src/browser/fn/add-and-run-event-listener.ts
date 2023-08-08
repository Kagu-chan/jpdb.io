export const _addAndRunEventListener = (
  e: HTMLElement | Document,
  ev: string,
  fn: EventListenerOrEventListenerObject,
): void => {
  e.addEventListener(ev, fn);
  if ('handleEvent' in fn) return fn.handleEvent(null);

  fn(null);
};
