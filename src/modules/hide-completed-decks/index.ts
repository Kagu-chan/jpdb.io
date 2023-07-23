import { container } from '../../lib/elements/container';
import { Deck } from './deck';

class HideCompletedDecks {
  private HIDE_COMPLETED_DECKS: string = 'hide-completed-decks';
  private HIDE_THRESHOLD_DECKS: string = 'hide-threshold-decks';
  private HIDE_NON_NEW_FIRST: string = 'hide-non-new-first';
  private DECK_EXCLUSION: string = "[id|='deck']:not([id*='l']):not([id*='n'])";

  private _deckList: Deck[];
  private _labelContainer: HTMLDivElement;

  constructor() {
    this.register();

    this.addRootCss();
    this.buildDeckList();

    this.hideCompletedDecks();
    this.hideThresholdDecks();
    this.hideNonNewFirstDecks();
  }

  private register(): void {
    jpdb.settings.registerConfigurable({
      name: this.HIDE_COMPLETED_DECKS,
      experimental: true,
      category: 'Decks',
      displayText: 'Hide completed decks',
      description:
        // eslint-disable-next-line max-len
        'Hides decks which do not contain new cards. This is evaluated against total amount, ignoring suspended cards',
    });

    jpdb.runOnce('/settings', () => {
      if (jpdb.settings.hasPatreonPerks()) {
        const tc = this.getTargetCoverage();

        jpdb.settings.registerConfigurable({
          name: this.HIDE_THRESHOLD_DECKS,
          experimental: true,
          category: 'Decks',
          displayText: 'Hide decks at Target coverage',
          description: `Hides decks where the estimated recognition matches the Target coverage set above, currently ${tc}%`,
        });
      } else {
        jpdb.settings.moduleManager.disableModule(this.HIDE_THRESHOLD_DECKS);
      }
    });

    jpdb.runOnce('/settings', () => {
      const rbs = jpdb.settings.getJpdbRadioSetting('learning-order');
      jpdb.settings.persistence.setModuleOption(this.HIDE_NON_NEW_FIRST, 'order', rbs);

      if (rbs.includes('all-decks')) {
        jpdb.settings.moduleManager.disableModule(this.HIDE_NON_NEW_FIRST);
      } else {
        jpdb.settings.registerConfigurable({
          name: this.HIDE_NON_NEW_FIRST,
          experimental: true,
          category: 'Decks',
          displayText: 'Hide non-new decks from front',
          description:
            // eslint-disable-next-line max-len
            'Hides decks which do not contain new cards. This is evaluated taking suspended cards into account and hides decks until the first deck serving new cards',
        });
      }
    });
  }

  private addRootCss(): void {
    jpdb.runOnceWhenEitherIsActive(
      /\/deck-list/,
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS, this.HIDE_NON_NEW_FIRST],
      () => {
        jpdb.css.add(
          `${this.HIDE_COMPLETED_DECKS}-${this.HIDE_THRESHOLD_DECKS}-${this.HIDE_NON_NEW_FIRST}`,
          __load_css('./src/modules/hide-completed-decks/root.css'),
        );

        this._labelContainer = document.jpdb.adjacentElement('h4', 'afterend', container([]));
        this._labelContainer.classList.add('show-hide-container');
      },
    );
  }

  private buildDeckList(): void {
    jpdb.runOnceWhenEitherIsActive(
      /\/deck-list/,
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS, this.HIDE_NON_NEW_FIRST],
      () => {
        this._deckList = document.jpdb
          .findElements<'div'>(`.deck${this.DECK_EXCLUSION}`)
          .map((d) => new Deck(d));
      },
    );
  }

  private hideCompletedDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive(/\/deck-list/, this.HIDE_COMPLETED_DECKS, () => {
      this.addCompletedDecksCss();
    });

    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_COMPLETED_DECKS, () => {
      this._deckList
        .filter((d) => d.completed)
        .forEach((d) => {
          hiddenDecks++;

          d.classList.add('completed');
        });

      this.displayShowHideControl(
        'decks completed',
        hiddenDecks,
        () => this.addCompletedDecksCss(),
        () => this.removeCompletedDecksCss(),
      );
    });
  }

  private hideThresholdDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive(/\/deck-list/, this.HIDE_THRESHOLD_DECKS, () => {
      this.addThresholdReachedCss();
    });

    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_THRESHOLD_DECKS, () => {
      this._deckList
        .filter((d) => d.coverageReached)
        .forEach((d) => {
          hiddenDecks++;

          d.classList.add('threshold-reached');
        });

      this.displayShowHideControl(
        'reached target coverage',
        hiddenDecks,
        () => this.addThresholdReachedCss(),
        () => this.removeThresholdReachedCss(),
      );
    });
  }

  private hideNonNewFirstDecks(): void {
    jpdb.runOnceWhenActive(/\/deck-list/, this.HIDE_NON_NEW_FIRST, () => {
      this.addNonNewCss();
    });

    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_NON_NEW_FIRST, () => {
      const hide: Deck[] = [];
      const found = this._deckList.find((d) => {
        if (!d.hasNewCards) {
          hide.push(d);

          return false;
        }

        return true;
      });

      if (!found) return;

      hide.forEach((d) => d.classList.add('non-new'));
      this.displayShowHideControl(
        'found before first learning deck',
        hide.length,
        () => this.addNonNewCss(),
        () => this.removeNonNewCss(),
      );
    });
  }

  private displayShowHideControl(
    label: string,
    amount: number,
    onAdd: Function,
    onRemove: Function,
  ): void {
    let isHidden: boolean = true;

    const text = (): string =>
      `${amount} decks ${label}` + (!!amount ? ` (${isHidden ? 'show' : 'hide'})` : '');

    const btn = document.jpdb.createElement('span', {
      class: ['show-hide-control'],
      innerText: text(),
      handler: () => {
        isHidden ? onRemove() : onAdd();
        isHidden = !isHidden;

        btn.innerText = text();
      },
    });

    if (!amount) {
      btn.classList.add('disabled');
    }

    document.jpdb.appendElement(this._labelContainer, btn);
  }

  private addCompletedDecksCss(): void {
    jpdb.css.add(
      this.HIDE_COMPLETED_DECKS,
      __load_css('./src/modules/hide-completed-decks/completed.css'),
    );
  }

  private removeCompletedDecksCss(): void {
    jpdb.css.remove(this.HIDE_COMPLETED_DECKS);
  }

  private addThresholdReachedCss(): void {
    jpdb.css.add(
      this.HIDE_THRESHOLD_DECKS,
      __load_css('./src/modules/hide-completed-decks/threshold-reached.css'),
    );
  }

  private removeThresholdReachedCss(): void {
    jpdb.css.remove(this.HIDE_THRESHOLD_DECKS);
  }

  private addNonNewCss(): void {
    jpdb.css.add(
      this.HIDE_NON_NEW_FIRST,
      __load_css('./src/modules/hide-completed-decks/non-new.css'),
    );
  }

  private removeNonNewCss(): void {
    jpdb.css.remove(this.HIDE_NON_NEW_FIRST);
  }

  private getTargetCoverage(): string {
    return jpdb.settings.getJpdbSetting('target-coverage');
  }
}

new HideCompletedDecks();
