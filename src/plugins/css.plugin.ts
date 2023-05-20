import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions } from '../lib/types';

export class CSSPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: /.*/,
    canBeDisabled: false,
    name: 'CSS Injector',
    runAgain: false,
  };

  private _style: HTMLStyleElement;
  private _styles = new Map<string, string>();

  public register(key: string, styles: string): void {
    this._styles.set(key, styles);

    this.applyStyles();
  }

  protected run(): void {
    const head = this._dom.findOne('head');

    this._style = this._dom.appendNewElement(head, 'style', {
      id: 'jpdb-script-runner-css',
    });

    this.applyStyles();
  }

  private applyStyles(): void {
    const styles: string[] = [];

    this._styles.forEach((s, k) => {
      styles.push(`/*!BEGIN ${k}*/\n${s}\n/*!END ${k}*/`);
    });
    this._style.innerText = styles.join('\n\n');
  }
}
