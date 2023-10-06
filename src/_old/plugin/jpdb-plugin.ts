import { DOMManager } from '../dom-manager';
import { Globals } from '../globals';
import { PluginOptions } from './types/plugin-options';
import {
  PluginUserOptions,
  PluginUserOption,
  PluginUserOptionFieldType,
} from './types/plugin-user-options';

export abstract class JPDBPlugin {
  protected abstract _pluginOptions: PluginOptions;
  protected _userSettings: PluginUserOptions = [];
  protected _usersSettings: Record<string, unknown> = {};
  protected _sleeps: boolean = false;

  /**
   * @deprecated
   */
  protected _dom: DOMManager;
  /**
   * @deprecated
   */
  protected _body: HTMLBodyElement;

  public get pluginOptions(): PluginOptions {
    return this._pluginOptions;
  }

  public get userSettings(): PluginUserOptions {
    return this._userSettings;
  }

  public get usersSettings(): Record<string, unknown> {
    return this._usersSettings;
  }

  public getUsersSetting<T = unknown>(key: string, defaultValue?: T): T {
    return (this._usersSettings[key] ?? defaultValue) as T;
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
    /* NOP */
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
      typeof activeAt === 'string' ? activeAt === '' : activeAt.test('');

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
    const {
      canBeDisabled,
      enableText,
      name,
      sourceLink,
      author,
      authorLink,
      description,
      beta,
      unfinished,
    } = this._pluginOptions;

    if (!canBeDisabled) {
      return;
    }

    const option: PluginUserOption = {
      key: 'enabled',
      type: PluginUserOptionFieldType.CHECKBOX,
      default: false,
      text: enableText ?? `Enable ${name.charAt(0).toLowerCase()}${name.slice(1)}`,
      description,
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

    if (beta) {
      const span = `<span class="beta">${unfinished ? 'unfinished' : 'beta'}</span>`;

      option.description = option.description ? `${option.description} ${span}` : span;
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
