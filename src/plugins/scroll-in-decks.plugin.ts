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
      text: 'Only add after a certain deck threshold',
      type: 'boolean',
      default: true,
    },
    {
      key: 'threshold',
      text: 'Required decks',
      type: 'number',
      // showWhen: 'set-treshold',
      default: 50,
      description: 'If you have less decks, the scroll controls wont be added to the deck list',
    },
  ];

  protected run(): void {
    // eslint-disable-next-line no-console
    console.log(this._usersSettings);
  }
}
