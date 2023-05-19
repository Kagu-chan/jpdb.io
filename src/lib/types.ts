export type CTOR<T, TArgs extends [...any[]] = []> = new (...args: [...TArgs]) => T;

export type PluginUserOptionType = 'boolean' | 'text' | 'textarea';
export type PluginUserOption = {
  key: string;
  text: string;
  default?: any;
  type: PluginUserOptionType;
};
export type PluginUserOptions = PluginUserOption[];
export type PluginOptions = {
  /**
   * @var {string} name Human Readable Plugin Name
   */
  name: string;
  /**
   * @var {string | RegExp} activeAt Regular Expression or literal stating on which pathname this plugin should interact
   */
  activeAt: string | RegExp;
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
