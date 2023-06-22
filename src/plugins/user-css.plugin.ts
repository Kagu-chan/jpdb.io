import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptionFieldType, PluginUserOptions } from '../lib/types';
import { CSSPlugin } from './css/css.plugin';

export class UserCSSPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    name: 'Custom CSS',
    activeAt: /.*/,
    canBeDisabled: true,
    description: 'If enabled, you can add own styles to the entire page',
    runAgain: true,
  };
  protected _userSettings: PluginUserOptions = [
    {
      key: 'styles',
      // text: 'Custom CSS',
      type: PluginUserOptionFieldType.TEXTAREA,
      default: '',
    },
  ];

  protected run(): void {
    Globals.pluginManager
      .get(CSSPlugin)
      .register(UserCSSPlugin.name, this.getUsersSetting('styles'));
  }
}
