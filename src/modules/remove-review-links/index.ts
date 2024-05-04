export class RemoveReviewLinks {
  private REMOVE_REVIEW_LINKS: string = 'remove-review-links';
  private REPLACE_WITH_DECKS: string = 'replace-with-decks';

  // href="/learn"

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.REMOVE_REVIEW_LINKS,
      category: 'Navigation',
      displayText: 'Remove review links',
      description:
        // eslint-disable-next-line max-len
        'Remove links pointing to your reviews. This is useful if you use JPDB.io as a pure tracking tool and do not want to use the learning features.',
      options: [
        {
          key: this.REPLACE_WITH_DECKS,
          type: 'checkbox',
          text: 'Replace with decks page',
          description: 'Replace the header review link with a link to the decks page.',
          default: false,
        },
      ],
    });
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable(/.*/, this.REMOVE_REVIEW_LINKS, () => this.removeReviewLinks());
    jpdb.runOnceOnDisable(/.*/, this.REMOVE_REVIEW_LINKS, () => this.addReviewLinks());

    jpdb.runAlwaysWhenActive(['/', '/learn'], this.REMOVE_REVIEW_LINKS, () => {
      document.jpdb.destroyElement('form[action="/review#a"]');
    });
    jpdb.runAlwaysWhenActive('/deck-list', this.REMOVE_REVIEW_LINKS, () => {
      document.jpdb.withElements('div.tooltip', (e: HTMLDivElement) => e.remove());
    });
  }

  private removeReviewLinks(): void {
    document.jpdb.withElement(
      'a[href="/learn"], a.nav-item[href="/deck-list"]',
      (e: HTMLAnchorElement) => {
        const linkToDecks = jpdb.settings.persistence.getModuleOption(
          this.REMOVE_REVIEW_LINKS,
          this.REPLACE_WITH_DECKS,
        );

        if (!e.getAttribute('original-text')) {
          e.setAttribute('original-text', e.innerHTML);
        }

        e.innerHTML = linkToDecks ? 'Deck list' : 'Learn page';
        e.setAttribute('href', linkToDecks ? '/deck-list' : '/learn');

        jpdb.once('update-remove-review-links-replace-with-decks', () => this.removeReviewLinks());
      },
    );
  }

  private addReviewLinks(): void {
    document.jpdb.withElement(
      'a[href="/learn"], a.nav-item[href="/deck-list"]',
      (e: HTMLAnchorElement) => {
        e.setAttribute('href', '/learn');
        e.innerHTML = e.getAttribute('original-text') ?? 'Review';
      },
    );
  }
}

new RemoveReviewLinks();
