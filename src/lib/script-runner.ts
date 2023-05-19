import { Plugins } from '../plugins/plugins';
import { Globals } from './globals';

export class ScriptRunner {
  public registerDefaults(): void {
    Globals.pluginManager.registerPlugins(...Plugins);
    Globals.pluginManager.loadAll();
  }

  public run(): void {
    Globals.pluginManager.runAll();
  }
}
