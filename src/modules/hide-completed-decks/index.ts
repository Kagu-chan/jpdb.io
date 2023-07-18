class HideCompletedDecks {
  private HIDE_COMPLETED_DECKS: string = 'hide-completed-decks';
  private HIDE_THRESHOLD_DECKS: string = 'hide-threshold-decks';
  private DECK_EXCLUSION: string = "[id|='deck']:not([id*='l']):not([id*='n'])";

  constructor() {
    this.register();

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

  private hideCompletedDecks(): void {
    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_COMPLETED_DECKS, () => {
      document.jpdb.withElements<'div'>(
        // eslint-disable-next-line max-len
        `.deck${this.DECK_EXCLUSION} .deck-body > div > div:first-of-type > div:first-of-type > div:last-of-type > div:nth-child(3) > div`,
        (textContainer: HTMLDivElement) => {
          if (this.getRecognition(textContainer) === 100) {
            document.jpdb.hideElement(textContainer.closest('.deck') as unknown as HTMLElement);
          }
        },
      );
    });
  }

  private hideThresholdDecks(): void {
    jpdb.runAlwaysWhenActive('/deck-list', this.HIDE_THRESHOLD_DECKS, () => {
      document.jpdb.withElements(
        // eslint-disable-next-line max-len
        `.deck${this.DECK_EXCLUSION} .deck-body > div > div:first-of-type > div:nth-child(2) > div:last-of-type > div:nth-child(3) > div`,
        (e: HTMLDivElement) => {
          if (this.getRecognition(e) >= this.getDeckTargetCoverage(e)) {
            document.jpdb.hideElement(e.closest('.deck') as unknown as HTMLElement);
          }
        },
      );
    });
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
