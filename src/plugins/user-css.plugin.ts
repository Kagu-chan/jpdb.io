import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptions } from '../lib/types';

export class UserCSSPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    name: 'CSS-Manager',
    activeAt: /.*/,
    canBeDisabled: true,
    runAgain: true,
  };
  protected _userSettings: PluginUserOptions = [
    {
      key: 'styles',
      text: 'Custom CSS',
      type: 'textarea',
      default: '',
    },
  ];

  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('Add CSS to HEADER');
  }
}
