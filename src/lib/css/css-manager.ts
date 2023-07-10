import { CSSOverwrite } from './css-overwrite.type';
import { betaPlugin } from './overwrites/beta-plugin';
import { customDefinition } from './overwrites/custom-definition';

export class CSSManager {
  private _style: HTMLStyleElement = document.jpdb.createElement('style');

  constructor() {
    document.jpdb.appendElement('head', this._style);

    this.add(betaPlugin);
    this.add(customDefinition);
  }

  public add({ key, css }: CSSOverwrite): void {
    const text = `/*!BEGIN ${key}*/\n${css.trim()}\n/*!END ${key}*/\n`;

    this._style.innerHTML += text;
  }
}
