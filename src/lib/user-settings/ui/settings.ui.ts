import EventEmitter from 'events';
import { EnableDisable, EnableDisableOptions } from './enable-disable/enable-disable';
import { InfoSection } from './info-section/info-section';

export class SettingsUI extends EventEmitter {
  // private _container = document.jpdb.findElement('.container.bugfix');

  private _sections = new Map<string, EnableDisable>();
  private _modules = document.jpdb.appendElement('.container.bugfix', {
    tag: 'div',
    class: ['hidden'],
    children: [
      {
        tag: 'h6',
        innerText: 'Extension Settings',
      },
    ],
  });
  private _infos: InfoSection = new InfoSection();

  constructor() {
    super();

    window.bubble(this._infos, this, 'reset');
  }

  public addEnableDisable(options: EnableDisableOptions): void {
    document.jpdb.showElement(this._modules);

    this._sections.set(options.name, new EnableDisable(this._modules, options));
  }
}
