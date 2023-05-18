export interface IJPDBPlugin {
  run(): boolean;
}

export type CTOR<T, TArgs extends [...any[]] = []> = new (...args: [...TArgs]) => T;

export type Activatable = { isActive(): boolean };
export type PluginStatic = CTOR<IJPDBPlugin> & Activatable;
export type PluginStaticOf<TPlugin extends IJPDBPlugin> = CTOR<TPlugin> & Activatable;
