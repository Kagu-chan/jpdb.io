import { NAME, VERSION } from './constants';
import { CSSManager } from './css/css-manager';
import { UserSettings } from './user-settings/user-settings';

export class ScriptRunner {
  public readonly css = new CSSManager();

  private readonly settings = new UserSettings();

  constructor() {
    // eslint-disable-next-line no-console
    console.log('%s %s running', NAME, VERSION);
  }
  // public registerDefaults(): void {
  //   Globals.pluginManager.registerPlugins(...Plugins);
  // }
  // public run(): void {
  //   Globals.pluginManager.runAll();
  //   document.addEventListener('virtual-refresh', () => Globals.pluginManager.runAll());
  // }
}
