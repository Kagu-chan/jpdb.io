import { DOMManager } from './browser/dom-manager';
import { Globals } from './globals';
import { PluginManager } from './plugin/plugin-manager';
import { Root } from './root';

export class JPDB extends Root {
  public get dom(): DOMManager {
    return Globals.domManager;
  }

  public get plugins(): PluginManager {
    return Globals.pluginManager;
  }
}
