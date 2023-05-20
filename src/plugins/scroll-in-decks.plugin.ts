import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptions } from '../lib/types';

export class ScrollInDecksPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/deck-list',
    canBeDisabled: true,
    name: 'Scroll-Controls in deck list',
    enabledByDefault: true,
    runAgain: true,
  };
  protected _userSettings: PluginUserOptions = [
    {
      key: 'set-threshold',
      text: 'Only show after a certain deck threshold',
      type: 'checkbox',
      default: true,
    },
    {
      key: 'threshold',
      type: 'number',
      dependsOn: 'set-threshold',
      hideOrDisable: 'hide',
      indent: true,
      default: 50,
      description: 'If you have less decks, the scroll controls wont be shown in the deck list',
    },
  ];

  protected run(): void {
    // eslint-disable-next-line no-console
    console.log(this._usersSettings);
  }
}
