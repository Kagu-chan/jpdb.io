import { DOMManager } from './browser/dom-manager';
import { Persistence } from './browser/persistence';
import { PluginManager } from './plugin/plugin-manager';

export class Globals {
  public static readonly pluginManager = new PluginManager();
  public static readonly persistence = new Persistence();
  public static readonly domManager = new DOMManager();
}
