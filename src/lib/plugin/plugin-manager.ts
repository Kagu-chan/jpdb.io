import { Globals } from '../globals';
import { CTOR, PluginUserOptions } from '../types';
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
    this._plugins.forEach((plugin) => plugin.loadUserSettings());
  }

  public runAll(): void {
    this._plugins.forEach((plugin) => plugin.execute());
  }

  public isPluginEnabled(key: string): boolean {
    return Globals.persistence.get('enabled')[key];
  }

  public setPluginEnabled(key: string, enabled: boolean): void {
    const current = Globals.persistence.get('enabled');

    if (current[key] === enabled) return;

    current[key] = enabled;
    Globals.persistence.set('enabled', current);
  }

  public getOptions(key: string): PluginUserOptions {
    return Globals.persistence.get('pluginOptions')[key] ?? [];
  }

  public setOptions(key: string, options: PluginUserOptions): void {
    const current = Globals.persistence.get('pluginOptions');

    current[key] = options;
    Globals.persistence.set('pluginOptions', current);
  }
}
