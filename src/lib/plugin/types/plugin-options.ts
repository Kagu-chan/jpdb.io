type RawPluginOptions = {
  /**
   * @var {string} name Human Readable Plugin Name
   */
  name: string;
  /**
   * @var {string} [description] Optional plugin description
   */
  description?: string;
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
   * @var {string} [enableText='Enable $PLUGINNAME'] Text to enable or disable the plugin
   */
  enableText?: string;
  /**
   * @var {string} [sourceLink] If set, forces `canBeDisabled` to `true`. Display the original source besides the enable control in settings
   */
  sourceLink?: string;
  /**
   * @var {string} [author] If set, forces `canBeDisabled` to `true`. Display the original author besides the enable control in settings
   */
  author?: string;
  /**
   * @var {string} [authorLink] If set and author is given, converts the author name into a link
   */
  authorLink?: string;
  /**
   * @var {boolean} [beta=false] Marks a plugin as beta, by default disabeling the deck until beta decks are enabled
   */
  beta?: boolean;
};

type NonBetaPlugin = RawPluginOptions & {
  beta?: false;
};

type BetaPlugin = RawPluginOptions & {
  beta: true;
  canBeDisabled: true;
};

export type PluginOptions = NonBetaPlugin | BetaPlugin;
