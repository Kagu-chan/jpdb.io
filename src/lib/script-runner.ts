import { Cache } from './cache/cache';
import { NAME, VERSION } from './constants';
import { CSSManager } from './css/css-manager';
import { State } from './state/state';
import { Toaster } from './toaster/toaster';
import { UserSettings } from './user-settings/user-settings';

export class ScriptRunner {
  public readonly css = new CSSManager();
  public readonly settings = new UserSettings();
  public readonly cache = new Cache();
  public readonly state = new State();

  public get toaster(): Toaster {
    return this._toaster;
  }

  private reloadActions: Function[] = [];
  private singleActions: Function[] = [];
  private _listen: Record<string, Function[]> = {};
  private _listenOnce: Record<string, Function[]> = {};

  private _toaster = new Toaster(this.css);

  constructor() {
    // eslint-disable-next-line no-console
    console.log('%s %s running', NAME, VERSION);

    document.addEventListener('virtual-refresh', () => {
      this.refreshUiElements();

      [...this.reloadActions, ...this.singleActions].forEach((c): void => {
        (c as () => void)();
      });

      this.singleActions = [];
    });

    if (isMobile()) {
      const c = (): void => document.jpdb.findElement('.container.bugfix').classList.add('mobile');

      this.reloadActions.push(c);
      c();
    }

    this.css.add('main', __load_css('./src/lib/styles.css'));
  }

  /**
   * Runs a given Function once on the next virtual dom reload
   *
   * @param {Function} fn Function to execute
   */
  public onNextRefresh(fn: Function): void {
    this.singleActions.push(fn);
  }

  /**
   * Runs a given Function when loaded on a mobile device
   *
   * @param {Function} fn Function to execute
   */
  public onMobile(fn: Function): void {
    if (isMobile()) {
      fn();
    }
  }

  /**
   * Runs a given Function when loaded on a desktop device
   *
   * @param {Function} fn Function to execute
   */
  public onDesktop(fn: Function): void {
    if (!isMobile()) {
      fn();
    }
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
    if (this.settings.moduleManager.getActiveState(enableKey)) {
      this.runOnce(match, action);
    }
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string[]} enableKeys Keys of whom at least one needs to be enabled
   * @param {Function} action Function to execute
   */
  public runOnceWhenEitherIsActive(
    match: Path | Path[],
    enableKeys: string[],
    action: Function,
  ): void {
    if (enableKeys.some((key) => this.settings.moduleManager.getActiveState(key))) {
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
    if (this.settings.moduleManager.getActiveState(enableKey)) {
      this.runAlways(match, action);
    }
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings
   * Function will be executed on call and when virtual_refresh is called
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string[]} enableKeys Keys of whom at least one needs to be enabled
   * @param {Function} action Function to execute
   */
  public runAlwaysWhenEitherIsActive(
    match: Path | Path[],
    enableKeys: string[],
    action: Function,
  ): void {
    if (enableKeys.some((key) => this.settings.moduleManager.getActiveState(key))) {
      this.runAlways(match, action);
    }
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings
   * If `once`, Function will called once, otherwise on call and when virtual_refresh is called
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   * @param {boolean} once Execute only once or always
   */
  public runWhenActive(
    match: Path | Path[],
    enableKey: string,
    action: Function,
    once: boolean,
  ): void {
    if (once) {
      return this.runOnceWhenActive(match, enableKey, action);
    }

    return this.runAlwaysWhenActive(match, enableKey, action);
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings or when being enabled in settings
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   */
  public runOnceOnEnable(match: Path | Path[], enableKey: string, action: Function): void {
    this.on(
      `${enableKey}-enabled`,
      () => this.runOnce(match, action),
      this.settings.moduleManager.getActiveState(enableKey),
    );
  }

  /**
   * Runs a given Function when matching given Path object and when enabled in /settings or when being enabled in settings
   * Function will be executed on call and when virtual_refresh is called
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   */
  public runAlwaysOnEnable(match: Path | Path[], enableKey: string, action: Function): void {
    this.on(
      `${enableKey}-enabled`,
      () => this.runAlways(match, action),
      this.settings.moduleManager.getActiveState(enableKey),
    );
  }

  /**
   * Runs a given Function when matching given Path object and when being disabled in /settings
   *
   * @param {Path | Path[]} match Path match to fulfill
   * @param {string} enableKey Key which needs to be enabled
   * @param {Function} action Function to execute
   */
  public runOnceOnDisable(match: Path | Path[], enableKey: string, action: Function): void {
    this.on(`${enableKey}-disabled`, () => this.runOnce(match, action));
  }

  public on(eventName: string, cb: Function): void;
  public on(eventName: string, cb: () => void, run: boolean): void;

  public on(eventName: string, cb: Function, run?: boolean): void {
    if (!this._listen[eventName]) {
      this._listen[eventName] = [];
    }

    this._listen[eventName].push(cb);

    if (run) {
      cb();
    }
  }

  public once(eventName: string, cb: Function): void {
    if (!this._listenOnce[eventName]) {
      this._listenOnce[eventName] = [];
    }

    this._listenOnce[eventName].push(cb);
  }

  public emit(eventName: string, ...args: unknown[]): void {
    const cbs = [...(this._listen[eventName] ?? []), ...(this._listenOnce[eventName] ?? [])];

    this._listenOnce[eventName] = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    cbs.forEach((cb) => cb(...args));
  }

  public clearEvents(eventName: string): void {
    delete this._listen[eventName];
    delete this._listenOnce[eventName];
  }

  private refreshUiElements(): void {
    this._toaster = new Toaster(this.css);

    this.emit('ui');
  }
}
