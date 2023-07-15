import { EnableDisable, EnableDisableOptions } from './enable-disable/enable-disable';
import { InfoSection } from './info-section/info-section';

export class SettingsUI {
  public get id(): string {
    return this._modules.id;
  }

  private _sections = new Map<string, EnableDisable>();
  private _modules = document.jpdb.appendElement('.container.bugfix', {
    tag: 'div',
    class: ['hidden'],
    children: [
      {
        tag: 'h4',
        innerText: 'Extension Settings',
        style: {
          textAlign: 'center',
          opacity: '.85',
        },
      },
    ],
  });
  private _infos: InfoSection = new InfoSection();

  public addEnableDisable(options: EnableDisableOptions): void {
    document.jpdb.showElement(this._modules);

    this._sections.set(options.name, new EnableDisable(this._modules, options));
  }
}
