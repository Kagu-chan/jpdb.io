export {};

declare global {
  interface Window {
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
