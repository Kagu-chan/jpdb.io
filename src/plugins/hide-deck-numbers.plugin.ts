import { findElements } from '../lib/dom';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class HideDeckNumbersPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/learn', '/deck-list'],
    canBeDisabled: true,
    name: 'Hide deck numbers',
    runAgain: true,
    enableText: 'Hide deck numbers on learn page and deck list',
  };

  protected run(): void {
    return findElements("[id|='deck']:not([id*='l']):not([id*='n']) .deck-title").forEach(
      (e) => (e.innerHTML = e.innerHTML.replace(/\d+\. /, '')),
    );
  }
}
