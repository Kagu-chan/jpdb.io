import { InstanceManager } from './instance-manager';
import { PluginRegistry } from './plugin-registry';

export class Wrapper {
  //#region Singleton
  private static _instance: Wrapper;
  public static getInstance(): Wrapper {
    if (!this._instance) this._instance = new this();

    return this._instance;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  //#endregion

  public get plugins(): PluginRegistry {
    return InstanceManager.getInstance().pluginRegistry;
  }
}
