import { _bubble } from './fn/bubble';
import { _post_refresh_and_notify } from './fn/post-refresh-and-notify';

declare global {
  interface Window {
    bubble: typeof _bubble;
    post_refresh_and_notify: typeof _post_refresh_and_notify;

    post_and_refresh: () => void;
    virtual_refresh: () => void;
    xhr: (
      method: Parameters<XMLHttpRequest['open']>[0],
      url: Parameters<XMLHttpRequest['open']>[1],
      payload: object,
      callback: (data: null | XMLHttpRequest) => void,
    ) => void;
  }

  const bubble: typeof _bubble;
  const post_refresh_and_notify: typeof window.post_refresh_and_notify;

  const post_and_refresh: typeof window.post_and_refresh;
  const virtual_refresh: typeof window.virtual_refresh;
  const xhr: typeof window.xhr;
}

window.post_refresh_and_notify = _post_refresh_and_notify;
window.bubble = _bubble;
