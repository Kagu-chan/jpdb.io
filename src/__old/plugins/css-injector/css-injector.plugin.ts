import { JPDBPlugin } from '../../jpdb/plugin';
import { PluginStatic } from '../../types';

export class CSSInjectorPlugin extends JPDBPlugin(/.*/) {
  private ELEMENT_ID: string = 'jpdb-css-injector';
  private _e: HTMLStyleElement;

  constructor() {
    super();

    this.createStyleElement();
  }

  public run(): boolean {
    if (!this.hasStyleElement()) this.attachStyleElement();

    return true;
  }

  public register(source: PluginStatic, css: string): void;
  public register(source: PluginStatic, scope: string, css: string): void;

  public register(source: PluginStatic, p0: string, p1?: string): void {
    this._e.innerText = p1 ?? p0;
  }

  private createStyleElement(): void {
    this._e = document.createElement('style');
    this._e.setAttribute('id', this.ELEMENT_ID);
  }

  private hasStyleElement(): boolean {
    return !!document.getElementById(this.ELEMENT_ID);
  }

  private attachStyleElement(): void {
    document.querySelector('head').append(this._e);
  }
}
