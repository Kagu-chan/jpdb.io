import { bubble } from './fn/bubble';

declare global {
  interface Window {
    bubble: typeof bubble;

    virtual_refresh: () => void;
    xhr: (
      method: Parameters<XMLHttpRequest['open']>[0],
      url: Parameters<XMLHttpRequest['open']>[1],
      payload: object,
      callback: (data: null | XMLHttpRequest) => void,
    ) => void;
  }

  const virtual_refresh: typeof window.virtual_refresh;
  const xhr: typeof window.xhr;
}

window.bubble = bubble;
