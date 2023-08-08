import { CSSOverwrite } from './css-overwrite.type';
import { customDefinition } from './overwrites/custom-definition';

export class CSSManager {
  private _style: HTMLStyleElement = document.jpdb.createElement('style');
  private _registry = new Map<string, string>();

  constructor() {
    document.jpdb.appendElement('head', this._style);

    this.add(customDefinition);
  }

  public add(options: CSSOverwrite): void;
  public add(key: string, css: string): void;

  public add(p0: CSSOverwrite | string, p1?: string): void {
    const { key, css } = typeof p0 === 'string' ? { key: p0, css: p1 } : p0;

    if (this._registry.has(key)) return;
    this._registry.set(key, css.trim());

    this.renderKey(key);
  }

  public remove(...keys: string[]): void {
    let changed: boolean = false;

    keys
      .filter((key) => this._registry.has(key))
      .forEach((key: string) => {
        this._registry.delete(key);
        changed = true;
      });

    if (!changed) return;

    this._style.innerHTML = '';
    this._registry.forEach((_, key) => this.renderKey(key));
  }

  private renderKey(key: string): void {
    const text = `/*!BEGIN ${key}*/\n${this._registry.get(key)}\n/*!END ${key}*/\n`;

    this._style.innerHTML += text;
  }
}
