export type CTOR<T, TArgs extends [...any[]] = []> = new (...args: [...TArgs]) => T;
export type Activatable = { isActive(): boolean };
