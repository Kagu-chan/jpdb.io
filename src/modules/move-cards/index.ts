interface DeckTarget {
  deckId: number;
  label: string;
}
interface VocabData {
  s: string;
  v: string;
}

/**
 * @TODO: Implement
 */
class MoveCards {
  constructor() {
    this.register();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: MoveCards.name,
      category: 'Decks',
      displayText: 'Allow moving cards between decks',
      description: 'Adds a `Move card` option to the menu of single vocab cards',
      experimental: true,
      options: [
        {
          key: 'objects',
          type: 'objectlist',
          text: 'Target Decks',
          schema: [
            {
              key: 'deckId',
              label: 'Deck ID',
              type: 'number',
              min: 1,
            },
            {
              key: 'label',
              label: 'Label',
              type: 'text',
            },
          ],
          default: [],
        },
      ],
    });
  }
}

new MoveCards();
