import { NAME } from '../lib/constants';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class GreetingsPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    name: 'Greetings',
    activeAt: /.*/,
    canBeDisabled: false,
    runAgain: false,
  };

  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('%s %s running', NAME, this.VERSION);
  }
}
