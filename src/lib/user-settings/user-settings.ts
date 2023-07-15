import { IActivatable } from './activatable.interface';
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

      this._ui.on('reset', () => {
        localStorage.clear();

        location.reload();
      });
      this._ui.on('scroll-down', () => {
        document.jpdb.findElement(`#${this._ui.id}`)?.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  public getActiveState(name: string): boolean {
    return this._activeModules.includes(name);
  }

  public registerActivatable(options: IActivatable): void {
    const { name, displayText } = options;
    this._ui?.addEnableDisable({
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

      this.write(this.ACTIVE_MODULES, this._activeModules);
    }
  }

  public disableModule(name: string): void {
    if (this.getActiveState(name)) {
      document.dispatchEvent(new CustomEvent('module-disabled', { detail: { name } }));
      this._activeModules = this._activeModules.filter((n) => n !== name);

      this.write(this.ACTIVE_MODULES, this._activeModules);
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

  public getModuleOption<T>(module: string, key: string, defaultValue: T): T {
    return this.read<Record<string, T>>(module, { [key]: defaultValue })[key];
  }

  public setModuleOption<T>(module: string, key: string, value: T): void {
    const data = this.read<Record<string, T>>(module, {});

    data[key] = value;
    this.write(module, data);
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
