class DebloadReviewsModule {
  private DEBLOAT_REVIEWS: string = 'debloat-reviews';

  constructor() {
    this.register();

    this.on('/review', false, () => this.review());
    this.on(/\/kanji/, true, () => this.kanji());
    this.on(/\/vocabulary/, true, () => this.vocabulary());
    this.on('/search', true, () => this.search());
  }

  private register(): void {
    jpdb.settings.registerConfigurable({
      name: this.DEBLOAT_REVIEWS,
      category: 'Reviews',
      displayText: 'Remove unneccessary labels from review, vocabulary and search results',
      description:
        'Remove text that takes up valuable screen space on review, vocabulary and search results',
    });
  }

  private on(reg: Path, once: boolean, fn: Function): void {
    jpdb.runWhenActive(reg, this.DEBLOAT_REVIEWS, fn, once);
  }

  private review(): void {
    document.jpdb.withElements('.subsection-label', (e) => {
      if (!e.innerText.startsWith('Keyword') || !e.innerText.startsWith('Meanings')) e.remove();
    });
    document.jpdb.destroyElement('.keyword-missing');
  }

  private kanji(): void {
    document.jpdb.withElements('.subsection-label', (e) => {
      if (['Info', 'Composed of'].includes(e.innerText)) e.remove();
      document.jpdb.destroyElement('.keyword-missing');
    });
  }

  private vocabulary(): void {
    document.jpdb.withElements('.subsection-label', (e) => {
      if (['Meanings', 'Custom definition'].includes(e.innerText)) e.remove();
    });
  }

  private search(): void {
    document.jpdb.withElements('.subsection-label', (e) => {
      e.remove();
    });
  }
}

new DebloadReviewsModule();
