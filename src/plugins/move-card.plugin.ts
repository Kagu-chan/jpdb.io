import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptions } from '../lib/types';

export class MoveCardPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/deck',
    canBeDisabled: true,
    name: 'Move Cards',
    runAgain: true,
    enableText: 'Allow moving cards between decks',
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'objects',
      text: 'Target Decks',
      type: 'objectlist',
      default: [],
      schema: [
        {
          key: 'deckId',
          label: 'Deck ID',
          type: 'number',
          min: 1,
        },
        {
          key: 'label',
          label: 'Label',
          type: 'string',
        },
      ],
    },
  ];

  protected run(): void {
    if (this.isPremadeDeck()) return;

    // eslint-disable-next-line no-console
    console.log(this);
  }

  protected isPremadeDeck(): boolean {
    return this._dom
      .findOne<'p'>('.container p')
      ?.innerText.startsWith('This deck was created from');
  }
}
