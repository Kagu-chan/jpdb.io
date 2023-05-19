import { DOMContainer } from '../../lib/browser/dom-container';
import { UserSettingSection } from './user-setting-section';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { UserSettingsReset } from './user-settings.reset';
import { PluginSettingsSection } from './user-settings.types';

export class UserSettingsContainer extends DOMContainer {
  private _reset: UserSettingsReset;
  private _sections: UserSettingSection[];

  constructor(private _api: UserSettingsPluginAPI) {
    super('user-settings', 'Script-Runner Settings', 'h6');

    this._reset = new UserSettingsReset(this, this._api);
  }

  public render(): void {
    this._sections = [];
    this._api.sections.forEach((section: PluginSettingsSection, key: string) => {
      this._sections.push(new UserSettingSection(this, this._api, key, section));
    });

    super.render();

    this._sections.forEach((s) => s.render());
    this._reset.render();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this.findOne('.container.bugfix', 'div'), element);
  }
}
