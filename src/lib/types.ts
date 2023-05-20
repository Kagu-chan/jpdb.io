export type CTOR<T, TArgs extends [...any[]] = []> = new (...args: [...TArgs]) => T;

type ReservedKey = 'enabled';

export type PluginUserOptionEnabled = {
  key: ReservedKey;
  text: string;
  type: 'boolean';
  default: boolean;
  description: undefined;
};

type PluginUserOptionBase<T> = {
  key: Exclude<string, ReservedKey>;
  text?: string;
  description?: string;
  default?: T;
};

type PluginUserOptionCheckbox = PluginUserOptionBase<boolean> & {
  type: 'boolean';
};
type PluginUserOptionText = PluginUserOptionBase<string> & {
  type: 'text';
  placeholder?: string;
};
type PluginUserOptionTextarea = PluginUserOptionBase<string> & {
  type: 'textarea';
  placeholder?: string;
};
type PluginUserOptionNumber = PluginUserOptionBase<number> & {
  type: 'number';
  placeholder?: string;
  min?: number;
  max?: number;
};

export type PluginUserOption =
  | PluginUserOptionEnabled
  | PluginUserOptionCheckbox
  | PluginUserOptionText
  | PluginUserOptionTextarea
  | PluginUserOptionNumber;
export type PluginUserOptions = PluginUserOption[];

export type PluginOptions = {
  /**
   * @var {string} name Human Readable Plugin Name
   */
  name: string;
  /**
   * @var {string | RegExp | Array<string | RegExp>} activeAt Regular Expression or literal stating on which pathname this plugin should interact
   */
  activeAt: string | RegExp | Array<string | RegExp>;
  /**
   * @var {boolean} runAgain Weather or not the plugin should run again after a virtual reload
   */
  runAgain: boolean;
  /**
   * @var {boolean} canBeDisabled Weather or not the plugin can be disabled by the user
   */
  canBeDisabled: boolean;
  /**
   * @var {boolean} [enabledByDefault] Weather or not the plugin is enabled by default or not. Only effective if `canBeDisabled` is true. Defaults to false
   */
  enabledByDefault?: boolean;
};
