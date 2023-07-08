import { DOMContainer } from '../../lib/browser/dom-container';
import { UserSettingsOther } from './controls/user-settings.other';
import { UserSettingsReset } from './controls/user-settings.reset';
import { UserSettingsSave } from './controls/user-settings.save';
import { UserSettingsSection } from './controls/user-settings.section';
import { UserSettingsUpdate } from './controls/user-settings.update';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { PluginSettingsSection } from './user-settings.types';

export class UserSettingsContainer extends DOMContainer {
  private _other: UserSettingsOther;
  private _reset: UserSettingsReset;
  private _updates: UserSettingsUpdate;
  private _save: UserSettingsSave;
  private _sections: UserSettingsSection[];

  constructor(public readonly api: UserSettingsPluginAPI) {
    super('user-settings', 'Extension settings', 'h6');

    this._other = new UserSettingsOther(this);
    this._reset = new UserSettingsReset(this);
    this._save = new UserSettingsSave(this);
    this._updates = new UserSettingsUpdate(this);
  }

  public render(): void {
    this._sections = [];
    this.api.sections.forEach((section: PluginSettingsSection, key: string) => {
      this._sections.push(new UserSettingsSection(this, key, section));
    });

    super.render();

    this._sections.forEach((s) => s.render());

    this.addRemDiv();
    this._other.render();
    this._reset.render();
    this._updates.render();
    this._save.render();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this.findOne('.container.bugfix', 'div'), element);
  }
}
