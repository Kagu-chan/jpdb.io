import { renderCommon } from './common';
import { SCROLL_CONTROLS } from './constants';
import { moduleOptions } from './module-options';
import { renderSettings, unrenderSettings } from './settings';
import { ScrollControlOrder, ScrollControlPosition } from './types';

class ScrollControls {
  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.renameModuleSetting('scroll-controls', SCROLL_CONTROLS);
    jpdb.settings.moduleManager.register(moduleOptions);
  }

  private addListeners(): void {
    const { persistence } = jpdb.settings;
    const buttonOrder = persistence.getModuleOption<ScrollControlOrder>(
      SCROLL_CONTROLS,
      'button-order',
    );
    const buttonPositon = persistence.getModuleOption<ScrollControlPosition>(
      SCROLL_CONTROLS,
      'button-position',
    );

    const runOn = (path: Path | Path[], setting: string): void => {
      persistence.getModuleOption(SCROLL_CONTROLS, setting) &&
        jpdb.runAlwaysWhenActive(path, SCROLL_CONTROLS, () => {
          renderCommon(buttonOrder, buttonPositon);
        });
    };

    jpdb.runOnceOnEnable('/settings', SCROLL_CONTROLS, () => this.enableOnSettings());
    jpdb.runOnceOnDisable('/settings', SCROLL_CONTROLS, () => this.disableOnSettings());

    jpdb.runAlwaysWhenActive('/deck-list', SCROLL_CONTROLS, () => {
      if (
        persistence.getModuleOption(SCROLL_CONTROLS, 'in-deck-list') &&
        persistence.getModuleOption(SCROLL_CONTROLS, 'set-threshold') &&
        this.countDecks() > persistence.getModuleOption<number>(SCROLL_CONTROLS, 'threshold')
      ) {
        renderCommon(buttonOrder, buttonPositon);
      }
    });

    runOn(
      [
        '/prebuilt_decks',
        '/anime-difficulty-list',
        '/novel-difficulty-list',
        '/visual-novel-difficulty-list',
        '/web-novel-difficulty-list',
        '/live-action-difficulty-list',
      ],
      'in-media-search',
    );
    runOn('/labs/wall-of-kanji', 'in-kanji-wall');
    runOn('/kanken-kanji', 'in-kanken-kanji');
    runOn('/kanji-by-frequency', 'in-kanji-freq');
  }

  //#region Settings
  private enableOnSettings(): void {
    const relevant = ['in-settings', 'button-order', 'button-position'];

    relevant
      .map((r) => `update-${SCROLL_CONTROLS}-${r}`)
      .concat('settings-nav-enabled', 'settings-nav-disabled')
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
    const buttonOrder = persistence.getModuleOption<ScrollControlOrder>(
      SCROLL_CONTROLS,
      'button-order',
    );
    const buttonPositon = persistence.getModuleOption<ScrollControlPosition>(
      SCROLL_CONTROLS,
      'button-position',
    );

    unrenderSettings();

    if (persistence.getModuleOption(SCROLL_CONTROLS, 'in-settings')) {
      renderSettings(buttonOrder, buttonPositon);
    }
  }
  //#endregion

  private countDecks(): number {
    // Find id's containing 'deck', but not 'l' (g"l"obal, b"l"acklisted) or 'n' ("n"ever-forgot)
    return document.jpdb.countElements("[id|='deck']:not([id*='l']):not([id*='n'])");
  }
}

new ScrollControls();
