export const JPDBRequest = <TResult = unknown>(
  method: Parameters<typeof xhr>[0],
  url: Parameters<typeof xhr>[1],
  payload: Parameters<typeof xhr>[2],
): Promise<TResult> => {
  return new Promise((res, rej) => {
    xhr(method, url, payload, (req: null | XMLHttpRequest) => {
      if (req === null) {
        rej();
      }

      res(req.response as TResult);
    });
  });
};
