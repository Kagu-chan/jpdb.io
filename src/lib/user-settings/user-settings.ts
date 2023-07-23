import { ModuleManager } from './module-manager';
import { IActivatable } from './ui/module-settings/activatable.interface';
import { SettingsUI } from './ui/settings-ui';
import { UserSettingsPersistence } from './user-settings-persistence';

export class UserSettings {
  public readonly persistence = new UserSettingsPersistence();
  public readonly moduleManager = new ModuleManager();

  private SETTINGS = '/settings';

  private _ui: SettingsUI;

  constructor() {
    this.onSettings(() => {
      this._ui = new SettingsUI();
    });
  }

  public registerConfigurable(options: IActivatable): void {
    const { name, displayText } = options;

    this._ui?.registerConfigurable({
      ...options,
      displayText: displayText ?? name,
      value: this.moduleManager.getActiveState(name),
      change: (val: boolean) => {
        val ? this.moduleManager.enableModule(name) : this.moduleManager.disableModule(name);
      },
    });
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

  public getJpdbRadioSetting(name: string): string {
    return document.jpdb.findElements<'input'>(`[name="${name}"]`).find((e) => e.checked)?.value;
  }

  private onSettings(fn: Function): void {
    if (location.match(this.SETTINGS)) {
      fn();
    }
  }
}
