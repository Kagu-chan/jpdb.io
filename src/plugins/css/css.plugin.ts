import { JPDBPlugin } from '../../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../../lib/types';
import { FixFn } from './css.types';
import { betaPlugin } from './fixes/beta.plugin';
import { customDefinitionFix } from './fixes/custom-definition.fix';

export class CSSPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: /.*/,
    canBeDisabled: false,
    name: 'CSS Injector',
    runAgain: false,
  };

  private _style: HTMLStyleElement;
  private _styles = new Map<string, string>();

  private _fixes: FixFn[] = [customDefinitionFix, betaPlugin];

  public register(key: string, styles: string): void {
    this._styles.set(key, styles);

    this.applyStyles();
  }

  protected run(): void {
    const head = this._dom.findOne('head');

    this._style = this._dom.appendNewElement(head, 'style', {
      id: 'jpdb-script-runner-css',
    });

    this._fixes.forEach((fn) =>
      fn((key: string, css: string) => this._styles.set(`fix:${key}`, css)),
    );

    this.applyStyles();
  }

  private applyStyles(): void {
    const styles: string[] = [];

    this._styles.forEach((s, k) => {
      styles.push(`/*!BEGIN ${k}*/\n${s}\n/*!END ${k}*/`);
    });
    this._style.innerHTML = styles.join('\n\n');
  }
}
