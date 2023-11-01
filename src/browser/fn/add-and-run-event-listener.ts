export const _addAndRunEventListener = (
  e: HTMLElement | Document,
  ev: string,
  fn: EventListenerOrEventListenerObject,
): void => {
  e.addEventListener(ev, fn);

  if ('handleEvent' in fn) {
    return fn.handleEvent(new Event('null'));
  }

  fn(new Event('null'));
};
