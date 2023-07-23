import { IActivatable } from './ui/module-settings/activatable.interface';
import { SettingsUI } from './ui/settings-ui';
import { UserSettingsPersistence } from './user-settings-persistence';

export class UserSettings {
  public readonly persistence = new UserSettingsPersistence();

  private SETTINGS = '/settings';
  private ACTIVE_MODULES = 'active-modules';

  private _ui: SettingsUI;
  private _activeModules: string[];

  constructor() {
    this._activeModules = this.persistence.read<string[]>(this.ACTIVE_MODULES, []);

    this.onSettings(() => {
      this._ui = new SettingsUI();
    });
  }

  public getActiveState(name: string): boolean {
    return this._activeModules.includes(name);
  }

  public registerConfigurable(options: IActivatable): void {
    const { name, displayText } = options;

    this._ui?.registerConfigurable({
      ...options,
      displayText: displayText ?? name,
      value: this.getActiveState(name),
      change: (val: boolean) => {
        val ? this.enableModule(name) : this.disableModule(name);
      },
    });
  }

  public enableModule(name: string): void {
    if (!this.getActiveState(name)) {
      document.dispatchEvent(new CustomEvent('module-enabled', { detail: { name } }));
      this._activeModules.push(name);

      this.persistence.write(this.ACTIVE_MODULES, this._activeModules);
    }
  }

  public disableModule(name: string): void {
    if (this.getActiveState(name)) {
      document.dispatchEvent(new CustomEvent('module-disabled', { detail: { name } }));
      this._activeModules = this._activeModules.filter((n) => n !== name);

      this.persistence.write(this.ACTIVE_MODULES, this._activeModules);
    }
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
