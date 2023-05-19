import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { NAME } from '../lib/constants';
import { PluginOptions } from '../lib/types';

export class GreetingsPlugin extends JPDBPlugin {
  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('%s %s running', NAME, this.VERSION);
  }

  protected getPluginOptions(): PluginOptions {
    return {
      activeAt: /.*/,
      canBeDisabled: false,
      runAgain: false,
    };
  }
}
