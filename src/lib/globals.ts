import { CSSManager } from './browser/css-manager';
import { DOMManager } from './browser/dom-manager';
import { Persistence } from './browser/persistence';
import { VERSION } from './constants';
import { JPDB } from './jpdb';
import { PluginManager } from './plugin/plugin-manager';
import { ScriptRunner } from './script-runner';

export class Globals {
  public static readonly VERSION = VERSION;
  public static readonly jpdb = new JPDB();
  public static readonly pluginManager = new PluginManager();
  public static readonly scriptRunner = new ScriptRunner();
  public static readonly persistence = new Persistence();
  public static readonly domManager = new DOMManager();
  public static readonly cssManager = new CSSManager();

  public static makePublic(key: keyof typeof Globals, as: string = key): void {
    (window as unknown as Record<string, unknown>)[as] = this[key];
  }
}
