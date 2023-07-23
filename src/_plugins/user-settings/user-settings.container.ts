import { DOMContainer } from '../../lib/browser/dom-container';
import { UserSettingsSection } from './controls/user-settings.section';
import { UserSettingsPluginAPI } from './user-settings-plugin.api';
import { PluginSettingsSection } from './user-settings.types';

export class UserSettingsContainer extends DOMContainer {
  private _sections: UserSettingsSection[];

  constructor(public readonly api: UserSettingsPluginAPI) {
    super('user-settings', 'Extension settings', 'h6');
  }

  public render(): void {
    this._sections = [];
    this.api.sections.forEach((section: PluginSettingsSection, key: string) => {
      this._sections.push(new UserSettingsSection(this, key, section));
    });

    super.render();

    this._sections.forEach((s) => s.render());

    this.addRemDiv();
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this.findOne('.container.bugfix', 'div'), element);
  }
}
