import { IJPDBPlugin, PluginStatic, PluginStaticOf } from '../types';

export class PluginRegistry {
  public registerPlugins(...plugins: PluginStatic[]): void {
    plugins.forEach((p) => this.registerPlugin(p));
  }

  public registerPlugin(plugin: PluginStatic): void {
    let instance: IJPDBPlugin = undefined;

    if (plugin.isActive()) {
      instance = new plugin();
    }

    this._pluginMap.set(plugin, instance);
  }

  public get<TPlugin extends IJPDBPlugin = IJPDBPlugin>(p: PluginStaticOf<TPlugin>): TPlugin {
    return this._pluginMap.get(p) as TPlugin;
  }
}
