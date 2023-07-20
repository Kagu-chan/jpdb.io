class HideCompletedDecks {
  private HIDE_COMPLETED_DECKS: string = 'hide-completed-decks';
  private HIDE_THRESHOLD_DECKS: string = 'hide-threshold-decks';
  private DECK_EXCLUSION: string = "[id|='deck']:not([id*='l']):not([id*='n'])";

  constructor() {
    this.register();

    this.addRootCss();
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
    jpdb.runOnce('/deck-list', () => {
      if (
        !jpdb.settings.getActiveState(this.HIDE_COMPLETED_DECKS) &&
        !jpdb.settings.getActiveState(this.HIDE_THRESHOLD_DECKS)
      )
        return;

      jpdb.css.add(
        `${this.HIDE_COMPLETED_DECKS}${this.HIDE_THRESHOLD_DECKS}`,
        __load_css('./src/modules/hide-completed-decks/root.css'),
      );
    });
  }

  private hideCompletedDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive('/deck-list', this.HIDE_COMPLETED_DECKS, () => {
      this.addCompletedDecksCss();
    });

    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_COMPLETED_DECKS, () => {
      document.jpdb.withElements<'div'>(
        // eslint-disable-next-line max-len
        `.deck${this.DECK_EXCLUSION} .deck-body > div > div:first-of-type > div:first-of-type > div:last-of-type > div:nth-child(3) > div`,
        (textContainer: HTMLDivElement) => {
          if (this.getRecognition(textContainer) === 100) {
            hiddenDecks++;

            document.jpdb.closestElement(textContainer, '.deck').classList.add('completed');
          }
        },
      );

      this.displayCompletedCounter(hiddenDecks);
    });
  }

  private hideThresholdDecks(): void {
    let hiddenDecks: number = 0;

    jpdb.runOnceWhenActive('/deck-list', this.HIDE_THRESHOLD_DECKS, () => {
      this.addThresholdReachedCss();
    });

    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_THRESHOLD_DECKS, () => {
      document.jpdb.withElements(
        // eslint-disable-next-line max-len
        `.deck${this.DECK_EXCLUSION} .deck-body > div > div:first-of-type > div:nth-child(2) > div:last-of-type > div:nth-child(3) > div`,
        (e: HTMLDivElement) => {
          if (this.getRecognition(e) >= this.getDeckTargetCoverage(e)) {
            hiddenDecks++;

            document.jpdb.closestElement(e, '.deck').classList.add('threshold-reached');
          }
        },
      );

      this.displayThresholdReachedCounter(hiddenDecks);
    });
  }

  private displayCompletedCounter(amount: number): void {
    let isHidden: boolean = true;

    const text = (): string =>
      `${amount} decks completed` + (!!amount ? ` (${isHidden ? 'show' : 'hide'})` : '');

    const btn = document.jpdb.createElement('span', {
      class: ['show-hide-control'],
      innerText: text(),
      handler: () => {
        isHidden ? this.removeCompletedDecksCss() : this.addCompletedDecksCss();
        isHidden = !isHidden;

        btn.innerText = text();
      },
    });

    if (!amount) {
      btn.classList.add('disabled');
    }
    document.jpdb.adjacentElement('h4', 'beforeend', btn);
  }

  private displayThresholdReachedCounter(amount: number): void {
    let isHidden: boolean = true;

    const text = (): string =>
      `${amount} decks reached threshold` + (!!amount ? ` (${isHidden ? 'show' : 'hide'})` : '');

    const btn = document.jpdb.createElement('span', {
      class: ['show-hide-control'],
      innerText: text(),
      handler: () => {
        isHidden ? this.removeThresholdReachedCss() : this.addThresholdReachedCss();
        isHidden = !isHidden;

        btn.innerText = text();
      },
    });

    if (!amount) {
      btn.classList.add('disabled');
    }
    document.jpdb.adjacentElement('h4', 'beforeend', btn);
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

  private getRecognition(e: HTMLDivElement): number {
    return Number(e.innerText.split('(')[1]?.replace(/[^\d]/g, '') ?? 0);
  }

  private getDeckTargetCoverage(e: HTMLElement): number {
    return Number(
      (e?.parentElement?.nextSibling?.firstChild as HTMLElement)?.style?.left?.replace(
        /[^\d]/g,
        '',
      ),
    );
  }
}

new HideCompletedDecks();
