import { Globals } from '../../lib/globals';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginManager } from '../../lib/plugin/plugin-manager';
import { PluginSettingsSection } from './user-settings.types';

export class UserSettingsPluginAPI {
  public readonly sections = new Map<string, PluginSettingsSection>();

  private _manager: PluginManager;
  private _plugins: Map<string, JPDBPlugin>;

  constructor() {
    this._manager = Globals.pluginManager;
    this._plugins = this._manager.plugins;
  }

  public buildMaps(includeBeta: boolean): void {
    const plugins = Array.from(this._plugins.values());
    const activePlugins = plugins.filter((pl) => includeBeta || !pl.pluginOptions.beta);
    const invalidActivePlugins = plugins.filter(
      (pl) => !includeBeta && pl.pluginOptions.beta && pl.usersSettings['enabled'],
    );

    invalidActivePlugins.forEach((pl) => {
      // eslint-disable-next-line no-console
      console.log('Disable beta plugin [%s]', pl.pluginOptions.name);

      pl.setUsersSetting('enabled', false);
    });
    this.saveSettings(true);

    activePlugins
      .sort((l, r) =>
        l.pluginOptions.canBeDisabled !== r.pluginOptions.canBeDisabled
          ? l.pluginOptions.canBeDisabled
            ? -1
            : 1
          : l.pluginOptions.name > r.pluginOptions.name
          ? 1
          : -1,
      )
      .forEach((p: JPDBPlugin) => {
        const newSection: PluginSettingsSection = {
          plugin: p,
          header: p.pluginOptions.enableText ?? p.pluginOptions.name,
          options: p.userSettings,
        };

        if (newSection.options.length) {
          this.sections.set(p.constructor.name, newSection);
        }
      });
  }

  public resetSettings(): void {
    Globals.persistence.unset();

    window.location.reload();
  }

  public saveSettings(skipReload?: boolean): void {
    const pluginSettings: ReturnType<typeof Globals.persistence.get<'plugins'>> = {};

    this._plugins.forEach((p: JPDBPlugin) => {
      if (!p.userSettings.length) return;

      pluginSettings[p.constructor.name] = {};

      p.userSettings.forEach(({ key }) => {
        pluginSettings[p.constructor.name][key] = p.usersSettings[key];
      });
    });

    Globals.persistence.set('plugins', pluginSettings);

    if (skipReload) return;
    window.location.reload();
  }
}
