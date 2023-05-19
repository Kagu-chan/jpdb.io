import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class UserCSSPlugin extends JPDBPlugin {
  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('Add CSS to HEADER');
  }

  protected getPluginOptions(): PluginOptions {
    return {
      name: 'CSS-Manager',
      activeAt: /.*/,
      canBeDisabled: true,
      runAgain: true,
      userOptions: [
        {
          key: 'styles',
          text: 'Custom CSS',
          type: 'textarea',
          default: '',
        },
        {
          key: 'foo',
          text: 'bar',
          type: 'text',
          default: 'Günther',
        },
      ],
    };
  }
}
