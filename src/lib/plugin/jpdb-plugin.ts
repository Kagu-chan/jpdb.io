import { DOMManager } from '../browser/dom-manager';
import { Globals } from '../globals';
import { Root } from '../root';
import { PluginOptions, PluginUserOptions } from '../types';

export abstract class JPDBPlugin extends Root {
  protected abstract _pluginOptions: PluginOptions;
  protected _userSettings: PluginUserOptions = [];
  protected _usersSettings: Record<string, unknown> = {};
  protected _sleeps: boolean = false;

  protected _dom: DOMManager;

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

  public initialize(): void {
    this.validateGivenOptions();
    this.unshiftEnableSetting();

    this._dom = Globals.domManager;
  }

  public loadUsersSettings(): void {
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
    const isActive = (activeAt: string | RegExp): boolean =>
      typeof activeAt === 'string' ? activeAt === this.PATH : activeAt.test(this.PATH);

    return (
      !this._sleeps &&
      this.isEnabled() &&
      (Array.isArray(this._pluginOptions.activeAt)
        ? !!this._pluginOptions.activeAt.find((a) => isActive(a))
        : isActive(this._pluginOptions.activeAt))
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
    if (!this._pluginOptions.canBeDisabled) return;

    const enableSetting = this._userSettings.find(({ key }) => key === 'enabled') ?? {
      key: 'enabled',
      text: `Enable ${this._pluginOptions.name}`,
      type: 'boolean',
      default:
        this._pluginOptions.enabledByDefault === undefined
          ? false
          : this._pluginOptions.enabledByDefault,
    };
    const sortedOptions = [
      enableSetting,
      ...this._userSettings.filter(({ key }) => key !== 'enabled'),
    ];

    this._userSettings = sortedOptions;
  }

  private validateGivenOptions(): void {
    const keys: string[] = [];

    this._userSettings?.forEach((options) => {
      if (keys.includes(options.key))
        throw new Error(`Option key '${options.key}' is already in use`);

      if (
        options.key === 'enabled' &&
        (options.description || options.default || options.type !== 'boolean')
      )
        throw new Error(
          // eslint-disable-next-line max-len
          "Option key 'enabled' is a reserved keyword and must be used as 'boolean' value! Check type 'PluginUserOptionEnabled'",
        );

      keys.push(options.key);
    });
  }
}
