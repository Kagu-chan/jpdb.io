interface DeckTarget {
  deckId: number;
  label: string;
}
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type VocabData = {
  s: string;
  v: string;
};

class MoveCards {
  private MOVE_CARDS: string = 'move-cards';
  private _currentDeckId: number;

  constructor() {
    this.register();

    this.addEventListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.MOVE_CARDS,
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

  private addEventListeners(): void {
    jpdb.runAlwaysWhenActive('/deck', this.MOVE_CARDS, () => {
      if (this.isPremadeDeck()) {
        return;
      }

      this._currentDeckId = Number(location.query<string>('id'));

      if (Number.isNaN(this._currentDeckId)) {
        return;
      }

      const targets = jpdb.settings.persistence
        .getModuleOption<DeckTarget[]>(this.MOVE_CARDS, 'objects')
        .filter(({ deckId }) => deckId != this._currentDeckId);

      if (!targets.length) {
        return;
      }

      this.renderTargets(targets);
    });
  }

  private isPremadeDeck(): boolean {
    return document.jpdb
      .findElement('.container p')
      ?.innerText.startsWith('This deck was created from');
  }

  private renderTargets(targets: DeckTarget[]): void {
    const domTargets: HTMLLIElement[] = document.jpdb
      .findElements<'li'>('.vocabulary-list ul li')
      .filter(({ innerHTML }) => innerHTML.match(/Edit meanings/));

    domTargets.forEach((e) => {
      targets.forEach((target) => {
        document.jpdb.adjacentElement(e, 'beforebegin', {
          tag: 'li',
          children: [
            {
              tag: 'a',
              innerText: `Move to ${target.label}`,
              handler: (): void => {
                const vocabData: VocabData = location.queryToObject<VocabData>(
                  document.jpdb.findElement(e, 'a')!.getAttribute('href')!.split('?')[1],
                );

                this.moveDeck(vocabData, target);
              },
            },
          ],
        });
      });
    });
  }

  private moveDeck(vocab: VocabData, { deckId }: DeckTarget): void {
    const addUrl = `https://jpdb.io/deck/${deckId}/add`;
    const remUrl = `https://jpdb.io/deck/${this._currentDeckId}/remove-from-deck`;
    const m = 'POST';
    const origin = `/deck?id=${this._currentDeckId}`;
    const send = {
      v: Number(vocab.v),
      s: Number(vocab.s),
      origin,
    };

    void xhrAsync(m, addUrl, send)
      .then(() =>
        xhrAsync(m, remUrl, {
          ...vocab,
          origin,
        }),
      )
      .then(() => virtual_refresh());
  }
}

new MoveCards();
