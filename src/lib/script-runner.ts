import { Plugins } from '../plugins/plugins';
import { Globals } from './globals';

export class ScriptRunner {
  public registerDefaults(): void {
    Globals.pluginManager.registerPlugins(...Plugins);
  }

  public run(): void {
    Globals.pluginManager.runAll();
  }
}
