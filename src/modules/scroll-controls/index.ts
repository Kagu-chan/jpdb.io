import { SCROLL_CONTROLS } from './constants';
import { moduleOptions } from './module-options';
import { renderSettings, unrenderSettings } from './settings';
import { ScrollControlOrder, ScrollControlPosition } from './types';

/**
 * @TODO: Implement
 */
class ScrollControls {
  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register(moduleOptions);
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable('/settings', SCROLL_CONTROLS, () => this.enableOnSettings());
    jpdb.runOnceOnDisable('/settings', SCROLL_CONTROLS, () => this.disableOnSettings());
  }

  //#region Settings
  private enableOnSettings(): void {
    const relevant = ['in-settings', 'button-order', 'button-position'];

    relevant
      .map((r) => `update-${SCROLL_CONTROLS}-${r}`)
      .forEach((e) => jpdb.on(e, () => this.updateOnSettings()));

    this.updateOnSettings();
  }

  private disableOnSettings(): void {
    const relevant = ['in-settings', 'button-order', 'button-position'];

    relevant.map((r) => `update-${SCROLL_CONTROLS}-${r}`).forEach((e) => jpdb.clearEvents(e));

    unrenderSettings();
  }

  private updateOnSettings(): void {
    const { persistence } = jpdb.settings;

    unrenderSettings();

    if (persistence.getModuleOption(SCROLL_CONTROLS, 'in-settings', false)) {
      renderSettings(
        persistence.getModuleOption(SCROLL_CONTROLS, 'button-order', ScrollControlOrder.BT),
        persistence.getModuleOption(SCROLL_CONTROLS, 'button-position', ScrollControlPosition.B),
      );
    }
  }
  //#endregion
}

new ScrollControls();
