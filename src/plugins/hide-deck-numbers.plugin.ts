import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class HideDeckNumbersPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/learn', '/deck-list'],
    canBeDisabled: true,
    name: 'Hide Deck-Numbers',
    runAgain: true,
    enableText: 'Hide deck numbers on learn page and deck list',
  };

  protected run(): void {
    return this._dom
      .find<'div'>("[id|='deck']:not([id*='l']):not([id*='n']) .deck-title")
      .forEach((e) => (e.innerHTML = e.innerHTML.replace(/\d+\. /, '')));
  }
}
