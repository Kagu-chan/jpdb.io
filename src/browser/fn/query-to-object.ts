export const queryToObject = <T extends Record<string, string | string[]>>(input: string): T => {
  return input.split('&').reduce((obj: Record<string, string | string[]>, cur: string) => {
    const [k, val] = cur?.split('=');

    if (obj[k] !== undefined) {
      if (!Array.isArray(obj[k])) {
        obj[k] = [obj[k] as string];
      }

      (obj[k] as string[]).push(val);

      return obj;
    }

    return Object.assign(obj, { [k]: val });
  }, {}) as T;
};
