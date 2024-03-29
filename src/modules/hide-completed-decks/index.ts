class HideCompletedDecks {
  private HIDE_COMPLETED_DECKS: string = 'hide-completed-decks';
  private HIDE_THRESHOLD_DECKS: string = 'hide-threshold-decks';
  private HIDE_NON_NEW_FIRST: string = 'hide-non-new-first';
  private DECK_EXCLUSION: string = "[id|='deck']:not([id*='l']):not([id*='n'])";

  private _deckList: Deck[];
  private _labelContainer: HTMLDivElement;
  private _deckContainer: HTMLDivElement;

  constructor() {
    this.register();

    this.addRootElements();
    this.buildDeckList();

    this.hideCompletedDecks();
    this.hideThresholdDecks();
    this.hideNonNewFirstDecks();

    this.displayShowControl();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.HIDE_COMPLETED_DECKS,
      category: 'Decks',
      displayText: 'Hide completed decks',
      description:
        // eslint-disable-next-line max-len
        'Hides decks which do not contain new cards. This is evaluated against total amount, ignoring suspended cards',
    });

    jpdb.runOnce('/settings', () => {
      if (jpdb.settings.hasPatreonPerks()) {
        const tc = this.getTargetCoverage();

        jpdb.settings.moduleManager.register({
          name: this.HIDE_THRESHOLD_DECKS,
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

      if (rbs === 'by-frequency-local-all-decks') {
        jpdb.settings.moduleManager.disableModule(this.HIDE_NON_NEW_FIRST);
      } else {
        jpdb.settings.moduleManager.register({
          name: this.HIDE_NON_NEW_FIRST,
          category: 'Decks',
          displayText:
            rbs === 'by-frequency-global-all-decks'
              ? 'Hide non-new decks'
              : 'Hide non-new decks from front',
          description:
            // eslint-disable-next-line max-len
            'Hides decks which do not contain new cards. This is evaluated taking suspended cards into account and hides decks until the first deck serving new cards',
        });
      }
    });
  }

  private addRootElements(): void {
    jpdb.runOnceWhenEitherIsActive(
      /\/deck-list/,
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS, this.HIDE_NON_NEW_FIRST],
      () => {
        jpdb.css.add(
          `${this.HIDE_COMPLETED_DECKS}-${this.HIDE_THRESHOLD_DECKS}-${this.HIDE_NON_NEW_FIRST}`,
          __load_css('./src/modules/hide-completed-decks/root.css'),
        );
      },
    );

    jpdb.runAlwaysWhenEitherIsActive(
      /\/deck-list/,
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS, this.HIDE_NON_NEW_FIRST],
      () => {
        this._labelContainer = document.jpdb.adjacentElement(
          'h4',
          'afterend',
          document.util.container([]),
        );
        this._labelContainer.classList.add('show-container');

        this._deckContainer = document.jpdb.findElement<'div'>('.deck-list');
        this._deckContainer.classList.add('hide-decks');
      },
    );
  }

  private buildDeckList(): void {
    jpdb.runAlwaysWhenEitherIsActive(
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
    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_COMPLETED_DECKS, () => {
      this._deckList
        .filter((d) => d.completed)
        .forEach((d) => {
          d.parameters.set('hidden', true);

          d.classList.add('completed');
        });
    });
  }

  private hideThresholdDecks(): void {
    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_THRESHOLD_DECKS, () => {
      this._deckList
        .filter((d) => d.coverageReached)
        .forEach((d) => {
          d.parameters.set('hidden', true);

          d.classList.add('threshold-reached');
        });
    });
  }

  private hideNonNewFirstDecks(): void {
    jpdb.runAlwaysWhenActive(/\/deck-list/, this.HIDE_NON_NEW_FIRST, () => {
      const rbs = jpdb.settings.persistence.getModuleOption(this.HIDE_NON_NEW_FIRST, 'order');
      const hide: Deck[] = [];
      let found: undefined | boolean | Deck;

      if (rbs === 'by-frequency-global-all-decks') {
        this._deckList.forEach((d) => {
          if (!d.hasNewCards) {
            hide.push(d);
          }
        });

        found = !!hide.length;
      } else {
        found = this._deckList.find((d) => {
          if (!d.hasNewCards) {
            hide.push(d);

            return false;
          }

          return true;
        });
      }

      if (!found) {
        return;
      }

      hide.forEach((d) => {
        d.parameters.set('hidden', true);

        d.classList.add('non-new');
      });
    });
  }

  private displayShowControl(): void {
    jpdb.runAlwaysWhenEitherIsActive(
      /\/deck-list/,
      [this.HIDE_COMPLETED_DECKS, this.HIDE_THRESHOLD_DECKS, this.HIDE_NON_NEW_FIRST],
      () => {
        const amount: number = this._deckList.filter((d) => d.parameters.get('hidden')).length;

        if (!amount) {
          return;
        }

        const btn = document.jpdb.createElement('span', {
          class: 'show-control',
          innerText: `Show ${amount} hidden deck${amount > 1 ? 's' : ''}`,
          handler: () => {
            this._deckContainer.classList.toggle('hide-decks');

            btn.remove();
          },
        });

        document.jpdb.appendElement(this._labelContainer, btn);
      },
    );
  }

  private getTargetCoverage(): string {
    return jpdb.settings.getJpdbSetting('target-coverage');
  }
}

new HideCompletedDecks();
