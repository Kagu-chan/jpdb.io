import { ModuleManager } from './module-manager/module-manager';
import { SettingsUI } from './ui/settings-ui';
import { UserSettingsPersistence } from './user-settings-persistence';

export class UserSettings {
  public readonly persistence;
  public readonly moduleManager;

  private SETTINGS = '/settings';

  private _ui: SettingsUI;

  constructor() {
    this.onSettings(() => {
      this._ui = new SettingsUI();
    });

    this.persistence = new UserSettingsPersistence();
    this.moduleManager = new ModuleManager(this._ui);
  }

  public hasPatreonPerks(): boolean {
    return !!document.jpdb.findElement('input[value="Unlink your account from Patreon"]');
  }

  public getJpdbSetting<T>(id: string): T {
    const e = document.jpdb.findElement<'input'>(`#${id}`);

    if (e.type === 'checkbox') {
      return e.checked as T;
    }

    return e.value as T;
  }

  public getJpdbRadioSetting(name: string): string | undefined {
    return document.jpdb.findElements<'input'>(`[name="${name}"]`).find((e) => e.checked)?.value;
  }

  public renameModuleSetting(sourceKey: string, targetKey: string): void {
    this._ui?.infoSection.addRenameMigrator(sourceKey, targetKey);
  }

  private onSettings(fn: Function): void {
    if (location.match(this.SETTINGS)) {
      fn();
    }
  }
}
