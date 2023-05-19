import { Globals } from '../../lib/globals';
import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginManager } from '../../lib/plugin/plugin-manager';
import { AppliedUserOption, PluginSettingsSection } from './user-settings.types';

export class UserSettingsPluginAPI {
  public readonly sections = new Map<string, PluginSettingsSection>();

  private _manager: PluginManager;
  private _plugins: Map<string, JPDBPlugin>;

  constructor() {
    this._manager = Globals.pluginManager;
    this._plugins = this._manager.plugins;
  }

  public buildMaps(): void {
    // this._plugins.forEach((p) => {
    //   const options: AppliedUserOption[] = [];
    //   if (p.pluginOptions.canBeDisabled) {
    //     options.push({
    //       text: `Enable ${p.pluginOptions.name}`,
    //       key: 'enable',
    //       type: 'boolean',
    //       value: Globals.pluginManager.isPluginEnabled(p.constructor.name),
    //     });
    //   }
    //   p.pluginOptions.userOptions?.forEach((o) => {
    //     options.push({
    //       text: o.text,
    //       key: o.key,
    //       type: o.type,
    //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //       value: p.userSettings.find(({ key }) => o.key === key).value,
    //     });
    //   });
    //   if (options.length) {
    //     this.sections.set(p.constructor.name, { header: p.pluginOptions.name, options });
    //   }
    // });
  }

  public resetSettings(): void {
    Globals.persistence.unset();

    window.location.reload();
  }

  public saveSettings(): void {
    window.location.reload();
  }

  public updateSetting(_pluginName: string, _option: AppliedUserOption): void {
    return;
    // if (option.key === 'enable') {
    //   // return Globals.pluginManager.setPluginEnabled(pluginName, option.value as boolean);
    // }

    // const currentOptions = Globals.pluginManager.getOptions(pluginName);
    // const relevantOption = currentOptions.find(({ key }) => key === option.key);

    // if (relevantOption) {
    //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //   // relevantOption.value = option.value;
    // } else {
    //   currentOptions.push(option);
    // }

    // Globals.pluginManager.setOptions(pluginName, currentOptions);
  }
}
