import { waitFor } from '../wait-for';

export const _xhrAsync = <TResult = unknown>(
  method: Parameters<typeof xhr>[0],
  url: Parameters<typeof xhr>[1],
  payload: Parameters<typeof xhr>[2],
): Promise<[TResult, string]> => {
  return new Promise((res, rej) => {
    void waitFor<'xhr'>('xhr', method, url, payload, (req: null | XMLHttpRequest) => {
      if (req === null) {
        rej();
      }

      res([req.response as TResult, req.responseText]);
    });
  });
};
