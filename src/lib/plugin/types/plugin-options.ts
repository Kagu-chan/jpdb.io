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
  /**
   * @var {string} [enableText='Enable $PLUGINNAME'] Text to enable or disable the plugin
   */
  enableText?: string;
};
