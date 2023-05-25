import { DOMManager } from '../browser/dom-manager';
import { Globals } from '../globals';
import { Root } from '../root';
import { PluginUserOption, PluginUserOptions } from '../types';
import { PluginOptions } from './types/plugin-options';

export abstract class JPDBPlugin extends Root {
  protected abstract _pluginOptions: PluginOptions;
  protected _userSettings: PluginUserOptions = [];
  protected _usersSettings: Record<string, unknown> = {};
  protected _sleeps: boolean = false;

  protected _dom: DOMManager;
  protected _body: HTMLBodyElement;

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
    this.applyThirdPartyChecks();
    this.validateGivenOptions();
    this.unshiftEnableOption();

    this._dom = Globals.domManager;
    this._body = this._dom.findOne<'body'>('body');
  }

  public loadUsersSettings(): void {
    const allPlugins = Globals.persistence.get('plugins') ?? {};
    const thisPlugin = allPlugins[this.constructor.name] ?? {};
    let persistDefaults: boolean = false;

    this._userSettings.forEach(({ key, default: defaultValue }) => {
      if (thisPlugin[key] === undefined) {
        thisPlugin[key] = defaultValue;

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

  private validateGivenOptions(): void {
    if (this._userSettings.find(({ key }) => key === 'enabled')) {
      throw new Error('Key `enabled` is reserved and not allowed as user setting');
    }
  }

  private unshiftEnableOption(): void {
    const { canBeDisabled, enableText, name, sourceLink, author, authorLink } = this._pluginOptions;

    if (!canBeDisabled) return;

    const option: PluginUserOption = {
      key: 'enabled',
      type: 'checkbox',
      default: false,
      text: enableText ?? `Enable ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
    };

    if (sourceLink?.length || author?.length) {
      const authorText = author?.length
        ? `Provided by <b>${
            authorLink?.length ? `<a href="${authorLink}" target="_blank">${author}</a>` : author
          }</b>`
        : undefined;
      const linkText = sourceLink?.length
        ? `Original source code available <b><a href="${sourceLink}" target="_blank">here</a></b>`
        : undefined;

      option.description = [authorText, linkText].filter((t) => !!t).join(' - ');
    }

    this._userSettings.unshift(option);

    this._userSettings
      .filter(({ key, dependsOn }) => key !== 'enabled' && !dependsOn)
      .forEach((object: PluginUserOption) => {
        Object.assign(object, {
          dependsOn: 'enabled',
          indent: true,
          hideOrDisable: 'hide',
        });
      });
  }

  private applyThirdPartyChecks(): void {
    if (this._pluginOptions.author?.length || this._pluginOptions.sourceLink?.length) {
      this._pluginOptions.canBeDisabled = true;
    }
  }
}
