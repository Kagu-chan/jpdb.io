import { SettingsUI } from './ui/settings.ui';

export class UserSettings {
  private SETTINGS = '/settings';
  private ACTIVE_MODULES = 'active-modules';

  private _ui: SettingsUI;
  private _activeModules: string[];

  constructor() {
    this._activeModules = this.read<string[]>(this.ACTIVE_MODULES, []);

    this.onSettings(() => {
      this._ui = new SettingsUI();

      // eslint-disable-next-line no-console
      this._ui.on('reset', () => console.log('reset was clicked'));
      this._ui.on('reset-all', () => {
        localStorage.clear();

        location.reload();
      });
    });
  }

  public getActiveState(name: string): boolean {
    return this._activeModules.includes(name);
  }

  public registerActivatable(name: string, displayText: string = name, description?: string): void {
    this.onSettings(() => {
      this._ui.addEnableDisable({
        name,
        displayText,
        value: this.getActiveState(name),
        description,
        change: (val: boolean) => {
          if (val && !this.getActiveState(name)) {
            this._activeModules.push(name);
          } else if (!val && this.getActiveState(name)) {
            this._activeModules = this._activeModules.filter((n) => n !== name);
          }

          this.write(this.ACTIVE_MODULES, this._activeModules);
        },
      });
    });
  }

  private onSettings(fn: Function): void {
    if (location.match(this.SETTINGS)) {
      fn();
    }
  }

  private read<TResult>(key: string, defaultValue: TResult): TResult {
    if (!localStorage.getItem(key)) {
      this.write(key, defaultValue);
    }

    return JSON.parse(localStorage.getItem(key)) as TResult;
  }

  private write<TData>(key: string, value: TData): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
