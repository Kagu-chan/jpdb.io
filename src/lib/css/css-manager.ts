import { CSSOverwrite } from './css-overwrite.type';
import { betaPlugin } from './overwrites/beta-plugin';
import { customDefinition } from './overwrites/custom-definition';

export class CSSManager {
  private _style: HTMLStyleElement = document.jpdb.createElement('style');
  private _knownKeys: string[] = [];

  constructor() {
    document.jpdb.appendElement('head', this._style);

    this.add(betaPlugin);
    this.add(customDefinition);
  }

  public add({ key, css }: CSSOverwrite): void {
    if (this._knownKeys.includes(key)) return;

    const text = `/*!BEGIN ${key}*/\n${css.trim()}\n/*!END ${key}*/\n`;

    this._knownKeys.push(key);
    this._style.innerHTML += text;
  }
}
