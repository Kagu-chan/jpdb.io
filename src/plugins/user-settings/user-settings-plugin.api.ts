import { Globals } from '../../lib/globals';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginManager } from '../../lib/plugin/plugin-manager';
import { PluginUserOption } from '../../lib/types';
import { PluginSettingsSection } from './user-settings.types';

export class UserSettingsPluginAPI {
  public readonly sections = new Map<string, PluginSettingsSection>();

  private _manager: PluginManager;
  private _plugins: Map<string, JPDBPlugin>;

  constructor() {
    this._manager = Globals.pluginManager;
    this._plugins = this._manager.plugins;
  }

  public buildMaps(): void {
    this._plugins.forEach((p: JPDBPlugin) => {
      const newSection: PluginSettingsSection = {
        plugin: p,
        header: p.pluginOptions.name,
        options: p.userSettings.map((setting: PluginUserOption) => ({
          key: setting.key,
          text: setting.text,
          type: setting.type,
          description: setting.description,
        })),
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

  public saveSettings(): void {
    const pluginSettings: ReturnType<typeof Globals.persistence.get<'plugins'>> = {};

    this._plugins.forEach((p: JPDBPlugin) => {
      if (!p.userSettings.length) return;

      pluginSettings[p.constructor.name] = {};

      p.userSettings.forEach(({ key }) => {
        pluginSettings[p.constructor.name][key] = p.usersSettings[key];
      });
    });

    Globals.persistence.set('plugins', pluginSettings);

    window.location.reload();
  }
}
