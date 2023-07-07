import { NAME, VERSION } from './constants';
import { CSSManager } from './css/css-manager';

export class ScriptRunner {
  public readonly css = new CSSManager();

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
