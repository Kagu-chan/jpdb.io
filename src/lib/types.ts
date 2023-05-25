export type CTOR<T, TArgs extends [...any[]] = []> = new (...args: [...TArgs]) => T;

export * from './plugin/types/plugin-options';
export * from './plugin/types/plugin-user-options';
