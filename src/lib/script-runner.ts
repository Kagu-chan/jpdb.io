import { NAME, VERSION } from './constants';
import { CSSManager } from './css/css-manager';
import { UserSettings } from './user-settings/user-settings';

export class ScriptRunner {
  public readonly css = new CSSManager();
  public readonly settings = new UserSettings();
  private reloadActions: Function[] = [];

  constructor() {
    // eslint-disable-next-line no-console
    console.log('%s %s running', NAME, VERSION);

    document.addEventListener('virtual-refresh', () =>
      this.reloadActions.forEach((c): void => (c as () => void)()),
    );
  }

  /**
   * Runs a given Function when matching given Path object
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {Function} action Function to execute
   */
  public runOnce(match: Path | Path[], action: Function): void {
    if (Array.isArray(match) ? match.find((m) => location.match(m)) : location.match(match)) {
      action();
    }
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   */
  public runOnceWhenActive(match: Path | Path[], enableKey: string, action: Function): void {
    if (this.settings.getActiveState(enableKey)) {
      this.runOnce(match, action);
    }
  }

  /**
   * Runs a given Function when matching given Path object
   * Function will be executed on call and when virtual_refresh is called
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {Function} action Function to execute
   */
  public runAlways(match: Path | Path[], action: Function): void {
    const c = (): void => this.runOnce(match, action);

    this.reloadActions.push(c);
    c();
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings
   * Function will be executed on call and when virtual_refresh is called
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   */
  public runAlwaysWhenActive(match: Path | Path[], enableKey: string, action: Function): void {
    if (this.settings.getActiveState(enableKey)) {
      this.runAlways(match, action);
    }
  }
}
