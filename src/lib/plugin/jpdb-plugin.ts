import { Globals } from '../globals';
import { Root } from '../root';
import { PluginOptions, PluginUserOptions } from '../types';

export abstract class JPDBPlugin extends Root {
  protected abstract _pluginOptions: PluginOptions;
  protected _userSettings: PluginUserOptions = [];
  protected _usersSettings: Record<string, unknown> = {};
  protected _sleeps: boolean = false;

  constructor() {
    super();
  }

  public get pluginOptions(): PluginOptions {
    return this._pluginOptions;
  }

  public get userSettings(): PluginUserOptions {
    return this._userSettings;
  }

  public get usersSettings(): Record<string, unknown> {
    return this._usersSettings;
  }

  public getUsersSetting<T = unknown>(key: string): T {
    return this._usersSettings[key] as T;
  }

  public setUsersSetting<T = unknown>(key: string, value: T): void {
    this._usersSettings[key] = value;
  }

  public loadUsersSettings(): void {
    this.unshiftEnableSetting();

    const allPlugins = Globals.persistence.get('plugins') ?? {};
    const thisPlugin = allPlugins[this.constructor.name] ?? {};
    let persistDefaults: boolean = false;

    this._userSettings.forEach(({ key, default: defaulValue }) => {
      if (thisPlugin[key] === undefined) {
        thisPlugin[key] = defaulValue;

        persistDefaults = true;
      }

      this._usersSettings[key] = thisPlugin[key];
    });

    if (persistDefaults) {
      allPlugins[this.constructor.name] = thisPlugin;

      Globals.persistence.set('plugins', allPlugins);
    }
  }

  public execute(): void {
    if (this.isActive()) {
      this.run();

      if (!this._pluginOptions.runAgain) {
        this._sleeps = true;
      }
    }
  }

  protected abstract run(): void;

  /**
   * Checks if the plugin is active (by pathname) and enabled
   *
   * @returns {boolean}
   */
  private isActive(): boolean {
    return (
      !this._sleeps &&
      this.isEnabled() &&
      (typeof this._pluginOptions.activeAt === 'string'
        ? this._pluginOptions.activeAt === this.PATH
        : this._pluginOptions.activeAt.test(this.PATH))
    );
  }

  /**
   * Checks if this plugin is enabled
   *
   * @returns {boolean}
   */
  private isEnabled(): boolean {
    if (this._pluginOptions.canBeDisabled) {
      return this.getUsersSetting('enabled');
    }

    return true;
  }

  private unshiftEnableSetting(): void {
    if (this._pluginOptions.canBeDisabled) {
      this._userSettings.unshift({
        key: 'enabled',
        text: `Enable ${this._pluginOptions.name}`,
        type: 'boolean',
        default:
          this._pluginOptions.enabledByDefault === undefined
            ? false
            : this._pluginOptions.enabledByDefault,
      });
    }
  }
}
