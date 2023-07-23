import { IActivatable } from './ui/module-settings/activatable.interface';
import { SettingsUI } from './ui/settings-ui';
import { UserSettingsPersistence } from './user-settings-persistence';

export class ModuleManager {
  private ACTIVE_MODULES = 'active-modules';

  private _persistence = new UserSettingsPersistence();
  private _activeModules: string[];

  constructor(private _ui: SettingsUI | undefined) {
    this._activeModules = this._persistence.read<string[]>(this.ACTIVE_MODULES, []);
  }

  public register(options: IActivatable): void {
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

  public getActiveState(name: string): boolean {
    return this._activeModules.includes(name);
  }

  public enableModule(name: string): void {
    if (!this.getActiveState(name)) {
      document.dispatchEvent(new CustomEvent('module-enabled', { detail: { name } }));
      this._activeModules.push(name);

      this._persistence.write(this.ACTIVE_MODULES, this._activeModules);
    }
  }

  public disableModule(name: string): void {
    if (this.getActiveState(name)) {
      document.dispatchEvent(new CustomEvent('module-disabled', { detail: { name } }));
      this._activeModules = this._activeModules.filter((n) => n !== name);

      this._persistence.write(this.ACTIVE_MODULES, this._activeModules);
    }
  }
}
