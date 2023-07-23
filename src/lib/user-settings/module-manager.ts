import { UserSettingsPersistence } from './user-settings-persistence';

export class ModuleManager {
  private ACTIVE_MODULES = 'active-modules';

  private _persistence = new UserSettingsPersistence();
  private _activeModules: string[];

  constructor() {
    this._activeModules = this._persistence.read<string[]>(this.ACTIVE_MODULES, []);
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
