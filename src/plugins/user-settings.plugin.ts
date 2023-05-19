import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOption } from '../lib/types';

export class UserSettingsPlugin extends JPDBPlugin {
  protected domElement: HTMLDivElement;
  protected settingsMap = new Map<string, PluginOptions>();
  protected optionsMap: Array<{ n: string; o: PluginUserOption }> = [];

  public isPluginEnabled(name: string): boolean {
    return this.settingsMap.get(name).canBeDisabled ? false : true;
  }

  protected run(): void {
    this.render();
  }

  protected getPluginOptions(): PluginOptions {
    return {
      activeAt: '/settings',
      canBeDisabled: false,
      runAgain: false,
    };
  }

  private buildInternalMaps(): void {
    // Globals.pluginManager.plugins.forEach(({ pluginOptions }, n) => {
    //   this.settingsMap.set(n, pluginOptions);
    //   if (pluginOptions.canBeDisabled) {
    //     this.optionsMap.push({
    //       n,
    //       o: {
    //         key: 'enabled',
    //         text: `Activate ${n}`,
    //         default: pluginOptions.enabledByDefault || false,
    //         value: /* current value || */ pluginOptions.enabledByDefault || false,
    //         type: 'boolean',
    //       },
    //     });
    //   }
    //   pluginOptions.userOptions?.forEach((o) => {
    //     this.optionsMap.push({
    //       n,
    //       o: {
    //         ...o,
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         value: /* current value || */ o.default,
    //       },
    //     });
    //   });
    // });
  }

  private render(): void {
    this.renderSettingsPanel();
    this.addResetControl();
    // eslint-disable-next-line no-console
    console.log('Render Settings...', this, Globals.pluginManager);
  }

  private renderSettingsPanel(): void {
    const { domManager } = Globals;

    const prependTo = domManager.filterOne(
      'h4',
      ({ innerText }) => innerText === 'Account information',
      'h4',
    );
    this.domElement = domManager.adjacentNewElement('beforebegin', prependTo, 'div', {
      id: 'extension-settings',
    });

    domManager.appendNewElement(this.domElement, 'h4', { innerText: 'Script-Runner Settings' });
  }

  private addResetControl(): void {
    Globals.domManager.appendNewElement(this.domElement, 'input', {
      class: ['outline', 'v1'],
      attributes: {
        type: 'submit',
        value: 'Reset Extension-Settings',
      },
      handler: () => this.resetSettings(),
    });
  }

  private resetSettings(): void {
    Globals.persistence.unset();

    window.location.reload();
  }
}
