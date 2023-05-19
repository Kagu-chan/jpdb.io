import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class UserCSSPlugin extends JPDBPlugin {
  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('Add CSS to HEADER');
  }

  protected getPluginOptions(): PluginOptions {
    return {
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
      ],
    };
  }
}
