export class HideLearningStats {
  private HIDE_LEARNING_STATS: string = 'hide-learning-stats';
  private DONT_HIDE_ON_DECKS: string = 'dont-hide-on-decks';
  private ALSO_HIDE_PROGRESS_NOTIFICATION: string = 'also-hide-progress-notification';

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
          description: 'Enableing this will keep the stats on the deck page itself.',
          default: false,
        },
        {
          key: this.ALSO_HIDE_PROGRESS_NOTIFICATION,
          type: 'checkbox',
          text: 'Also remove the progress notification',
          description:
            // eslint-disable-next-line max-len
            'This will also remove the progress notification on the home and learn page, which tells you how many cards you have left to learn on the current',
          default: true,
        },
      ],
    });
  }

  private addListeners(): void {
    const hideProgress = jpdb.settings.persistence.getModuleOption(
      this.HIDE_LEARNING_STATS,
      this.ALSO_HIDE_PROGRESS_NOTIFICATION,
    );

    jpdb.runAlwaysWhenActive('/', this.HIDE_LEARNING_STATS, () => {
      if (!hideProgress) {
        return;
      }

      document.jpdb.withElement('h4 + p', (e: HTMLParagraphElement) => e.remove());
    });

    jpdb.runAlwaysWhenActive('/learn', this.HIDE_LEARNING_STATS, () => {
      document.jpdb.withElement('h4', (e: HTMLHeadElement) => {
        const statsContainer = e.nextSibling as HTMLDivElement;
        const progress = statsContainer?.nextSibling as HTMLParagraphElement;

        statsContainer?.remove();
        hideProgress && progress?.remove();

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
        'div[style="margin-bottom: 1rem; display: flex;"] + div',
        (e: HTMLDivElement) => {
          e.remove();
        },
      );
    });
  }
}

new HideLearningStats();
