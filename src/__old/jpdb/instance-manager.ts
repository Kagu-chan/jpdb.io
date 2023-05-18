// import { IJPDBPlugin, PluginStatic } from '../types';
import { IJPDBPlugin, PluginStatic } from '../types';
import { PluginRegistry } from './plugin-registry';

/**
 * Class to manage instances internally
 *
 * Encapsulated by a public API to isolate against external access
 */
export class InstanceManager {
  private _pluginMap: Map<PluginStatic, IJPDBPlugin> = new Map();
  private _pluginRegistry = new PluginRegistry();

  //#region Singleton
  private static _instance: InstanceManager;
  public static getInstance(): InstanceManager {
    if (!this._instance) this._instance = new this();

    return this._instance;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  //#endregion

  public get pluginRegistry(): PluginRegistry {
    return this._pluginRegistry;
  }

  // public add(...plugins: PluginStatic[]): this {
  //   this._plugins.push(
  //     ...plugins
  //       .map((p) => {
  //         this._pluginMap.set(p, undefined);

  //         return p;
  //       })
  //       .filter((p) => p.isActive())
  //       .map((p) => new p()),
  //   );

  //   return this;
  // }

  // public runScripts(): void {
  //   this._plugins = this._plugins.filter((p) => this.run(p));
  // }

  // private run(p: IJPDBPlugin): boolean {
  //   const ctor = (Object.getPrototypeOf(p) as unknown).constructor as PluginStatic;
  //   const runAgain = p.run();

  //   this._pluginMap.set(ctor, runAgain ? p : undefined);

  //   return runAgain;
  // }
}
