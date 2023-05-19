import { Globals } from '../globals';
import { Root } from '../root';
import { PluginOptions, PluginUserOption, PluginUserOptions } from '../types';

export abstract class JPDBPlugin extends Root {
  protected abstract _pluginOptions: PluginOptions;
  protected _userOptions: PluginUserOptions;
  protected _sleeps: boolean = false;

  constructor() {
    super();
  }

  public get pluginOptions(): PluginOptions {
    return this._pluginOptions;
  }

  public get userOptions(): PluginUserOptions {
    return this._userOptions;
  }

  public loadUserSettings(): void {
    if (!this._pluginOptions.userOptions?.length) {
      return;
    }

    const options = this.applyDefaults(Globals.pluginManager.getOptions(this.constructor.name));
    this._userOptions = options;
  }

  public execute(): void {
    if (this.isActive()) {
      this.run();

      if (!this._pluginOptions.runAgain) {
        this._sleeps = true;
      }
    }
  }

  /**
   * Checks if the plugin is active (by pathname) and enabled
   *
   * @returns {boolean}
   */
  protected isActive(): boolean {
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
  protected isEnabled(): boolean {
    const { name } = this.constructor;

    if (this._pluginOptions.canBeDisabled) {
      if (Globals.pluginManager.isPluginEnabled(name) === undefined) {
        Globals.pluginManager.setPluginEnabled(name, this._pluginOptions.enabledByDefault ?? false);
      }

      return Globals.pluginManager.isPluginEnabled(name);
    }

    return true;
  }

  protected applyDefaults(options: PluginUserOptions): PluginUserOptions {
    const result: PluginUserOptions = [];

    this._pluginOptions.userOptions.forEach((data: PluginUserOption) => {
      result.push({
        key: data.key,
        text: data.text,
        type: data.type,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        default: data.default,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value: options.find(({ key }) => data.key === key)?.value ?? data.default,
      });
    });

    return result;
  }

  protected abstract run(): void;
}
