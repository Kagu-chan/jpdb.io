import { Activatable, CTOR } from '../types';
import { IJPDBPlugin } from './plugin.interface';

export class JPDBScriptRunner {
  private static _instance: JPDBScriptRunner;
  private _plugins: IJPDBPlugin[] = [];

  public static getInstance(): JPDBScriptRunner {
    if (!this._instance) this._instance = new this();

    return this._instance;
  }
  private constructor() {}

  public add(plugin: CTOR<IJPDBPlugin> & Activatable): this {
    if (plugin.isActive()) {
      const instance = new plugin();

      if (instance.run()) {
        this._plugins.push(instance);
      }
    }

    return this;
  }

  public runScripts(): void {
    this._plugins = this._plugins.filter((p) => p.run());
  }
}
