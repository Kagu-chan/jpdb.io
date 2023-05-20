import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';
import { CSSPlugin } from './css.plugin';

export class AutoSortDecksPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: ['/learn', '/deck-list'],
    canBeDisabled: true,
    name: 'Automatic deck sorting',
    runAgain: true,
  };

  protected run(): void {
    this.addCSS();
  }

  private addCSS(): void {
    Globals.pluginManager
      .get(CSSPlugin)
      .register(AutoSortDecksPlugin.name, '.deck-sidebar { display: none }');
  }
}
