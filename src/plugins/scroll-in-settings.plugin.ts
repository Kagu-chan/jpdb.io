import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class ScrollInSettingsPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/settings',
    canBeDisabled: true,
    name: 'Scroll controls in settings',
    enableText: 'Add <b>To top</b> and <b>To bottom</b> in settings',
    runAgain: false,
  };

  protected run(): void {
    const container = this._dom.findOne('#save-all-settings-box');

    this._dom.prependNewElement(container, 'input', {
      id: 'scroll-down',
      class: ['outline', 'v2'],
      attributes: {
        type: 'submit',
        value: 'To Bottom',
      },
      style: {
        marginLeft: '1.2rem',
        marginRight: 'auto',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      },
    });

    this._dom.appendNewElement(container, 'input', {
      id: 'scroll-up',
      class: ['outline', 'v2', 'scroll', 'right'],
      attributes: {
        type: 'submit',
        value: 'To Top',
      },
      style: {
        marginLeft: 'auto',
        marginRight: '1.2rem',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }
}
