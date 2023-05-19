import { CTOR } from '../types';
import { JPDBPlugin } from './jpdb-plugin';

export class PluginManager {
  private _plugins = new Map<string, JPDBPlugin>();

  public get plugins(): Map<string, JPDBPlugin> {
    return this._plugins;
  }

  public get<TPlugin extends JPDBPlugin>(plugin: CTOR<TPlugin>): TPlugin {
    return this._plugins.get(plugin.name) as TPlugin;
  }

  public registerPlugins(...plugins: JPDBPlugin[]): void {
    plugins.forEach((p) => this.registerPlugin(p));
  }

  public registerPlugin(plugin: JPDBPlugin): void {
    this._plugins.set(plugin.constructor.name, plugin);
  }

  public loadAll(): void {
    this._plugins.forEach((plugin) => {
      plugin.initialize();
      plugin.loadUsersSettings();
    });
  }

  public runAll(): void {
    this._plugins.forEach((plugin) => plugin.execute());
  }
}
