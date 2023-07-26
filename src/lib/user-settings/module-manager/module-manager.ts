import { SettingsUI } from '../ui/settings-ui';
import { UserSettingsPersistence } from '../user-settings-persistence';
import { IModuleOptions } from './module-options.type';
import { ModuleSection } from './module-section';

export class ModuleManager {
  private ACTIVE_MODULES = 'active-modules';

  private _persistence = new UserSettingsPersistence();
  private _activeModules: string[];

  private _stableModules: ModuleSection;
  private _experimentalModules: ModuleSection;

  constructor(private _ui: SettingsUI | undefined) {
    this._activeModules = this._persistence.read<string[]>(this.ACTIVE_MODULES, []);

    if (!this._ui) return;

    this._stableModules = new ModuleSection('Module settings', this._ui.stable);
    this._experimentalModules = new ModuleSection('Experimental settings', this._ui.experimental);
  }

  public register(options: IModuleOptions): void {
    if (!this._ui) return;

    jpdb.css.add({
      key: 'settings',
      css: __load_css('./src/lib/user-settings/ui/settings-ui.css'),
    });

    (options.experimental ? this._experimentalModules : this._stableModules).register(options);
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
