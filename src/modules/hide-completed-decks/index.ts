import { container } from '../../lib/elements/container';
import { Deck } from './deck';

class HideCompletedDecks {
  private HIDE_COMPLETED_DECKS: string = 'hide-completed-decks';
  private HIDE_THRESHOLD_DECKS: string = 'hide-threshold-decks';
  private DECK_EXCLUSION: string = "[id|='deck']:not([id*='l']):not([id*='n'])";

  private _deckList: Deck[];
  private _labelContainer: HTMLDivElement;

  constructor() {
    this.register();

    this.addRootCss();
    this.buildDeckList();

    this.hideCompletedDecks();
    this.hideThresholdDecks();
  }

  private register(): void {
    jpdb.settings.registerConfigurable({
      name: this.HIDE_COMPLETED_DECKS,
      experimental: true,
      category: 'Decks',
      displayText: 'Hide completed decks',
      description: 'Hides decks which do not contain new cards',
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
        jpdb.settings.disableModule(this.HIDE_THRESHOLD_DECKS);
      }
    });
  }

  private addRootCss(): void {
    jpdb.runOnceWhenEitherIsActive(
      '/deck-list',
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS],
      () => {
        jpdb.css.add(
          `${this.HIDE_COMPLETED_DECKS}${this.HIDE_THRESHOLD_DECKS}`,
          __load_css('./src/modules/hide-completed-decks/root.css'),
        );

        this._labelContainer = document.jpdb.adjacentElement('h4', 'afterend', container([]));
        this._labelContainer.classList.add('show-hide-container');
      },
    );
  }

  private buildDeckList(): void {
    jpdb.runOnceWhenEitherIsActive(
      '/deck-list',
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS],
      () => {
        this._deckList = document.jpdb
          .findElements<'div'>(`.deck${this.DECK_EXCLUSION}`)
          .map((d) => new Deck(d));
      },
    );
  }

  private hideCompletedDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive('/deck-list', this.HIDE_COMPLETED_DECKS, () => {
      this.addCompletedDecksCss();
    });

    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_COMPLETED_DECKS, () => {
      this._deckList
        .filter((d) => d.completed)
        .forEach((d) => {
          hiddenDecks++;

          d.classList.add('completed');
        });

      this.displayCompletedCounter(hiddenDecks);
    });
  }

  private hideThresholdDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive('/deck-list', this.HIDE_THRESHOLD_DECKS, () => {
      this.addThresholdReachedCss();
    });

    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_THRESHOLD_DECKS, () => {
      this._deckList
        .filter((d) => d.coverageReached)
        .forEach((d) => {
          hiddenDecks++;

          d.classList.add('threshold-reached');
        });

      this.displayThresholdReachedCounter(hiddenDecks);
    });
  }

  private displayCompletedCounter(amount: number): void {
    this.displayShowHideControl(
      'decks completed',
      amount,
      () => this.addCompletedDecksCss(),
      () => this.removeCompletedDecksCss(),
    );
  }

  private displayThresholdReachedCounter(amount: number): void {
    this.displayShowHideControl(
      'reached target coverage',
      amount,
      () => this.addThresholdReachedCss(),
      () => this.removeThresholdReachedCss(),
    );
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

  private getTargetCoverage(): string {
    return jpdb.settings.getJpdbSetting('target-coverage');
  }
}

new HideCompletedDecks();
