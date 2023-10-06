export const waitFor = <FN extends keyof Window>(
  fn: FN,
  ...args: [...Parameters<Window[FN]>]
): Promise<ReturnType<Window[FN]>> => {
  return new Promise((res) => {
    const wait = (): void => {
      if (window[fn]) {
        res((window[fn] as (...args: unknown[]) => unknown)(...args) as ReturnType<Window[FN]>);

        return;
      }

      setTimeout(() => wait(), 50);
    };

    wait();
  });
};
