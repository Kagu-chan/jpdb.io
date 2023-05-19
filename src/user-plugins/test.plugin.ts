import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class TestPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    name: 'Test-Manager',
    activeAt: /.*/,
    canBeDisabled: false,
    runAgain: true,
    userOptions: [
      {
        key: 'styles',
        text: 'Custom Test Code',
        type: 'textarea',
        default: 'flalalalalalala',
      },
      {
        key: 'foo',
        text: 'bar',
        type: 'text',
        default: 'Matilda',
      },
    ],
  };

  protected run(): void {
    // eslint-disable-next-line no-console
    console.log('Test for Settings!');
  }
}
