import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptions } from '../lib/types';
import { CSSPlugin } from './css.plugin';

export class UserCSSPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    name: 'Custom CSS',
    activeAt: /.*/,
    canBeDisabled: true,
    runAgain: true,
  };
  protected _userSettings: PluginUserOptions = [
    {
      key: 'styles',
      // text: 'Custom CSS',
      type: 'textarea',
      default: '',
    },
  ];

  protected run(): void {
    Globals.pluginManager
      .get(CSSPlugin)
      .register(UserCSSPlugin.name, this.getUsersSetting('styles'));
  }
}
