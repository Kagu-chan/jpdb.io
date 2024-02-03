export class HideLearningStats {
  private HIDE_LEARNING_STATS: string = 'hide-learning-stats';
  private DONT_HIDE_ON_DECKS: string = 'dont-hide-on-decks';

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.HIDE_LEARNING_STATS,
      category: 'Learn Page',
      displayText: 'Hide learning stats',
      description: 'Hide learning stats on the deck page on the decks itself',
      options: [
        {
          key: this.DONT_HIDE_ON_DECKS,
          type: 'checkbox',
          text: "Don't hide deck specific stats",
          default: false,
        },
      ],
    });
  }

  private addListeners(): void {
    jpdb.runAlwaysWhenActive('/learn', this.HIDE_LEARNING_STATS, () => {
      document.jpdb.withElement('h4', (e: HTMLHeadElement) => {
        const statsContainer = e.nextSibling as HTMLDivElement;
        const progress = statsContainer?.nextSibling as HTMLParagraphElement;

        statsContainer?.remove();
        progress?.remove();

        e?.remove();
      });
    });

    jpdb.runAlwaysWhenActive('/deck', this.HIDE_LEARNING_STATS, () => {
      if (
        jpdb.settings.persistence.getModuleOption(this.HIDE_LEARNING_STATS, this.DONT_HIDE_ON_DECKS)
      ) {
        return;
      }

      document.jpdb.withElement(
        'div[style="margin-bottom: 1rem; display: flex;"]',
        (e: HTMLDivElement) => {
          const statsContainer = e.nextSibling as HTMLDivElement;

          statsContainer?.remove();
        },
      );
    });
  }
}

new HideLearningStats();
