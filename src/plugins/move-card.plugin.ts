import { JPDBRequest } from '../lib/jpdb.io/request';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptionFieldType, PluginUserOptions } from '../lib/types';

type DeckTarget = {
  deckId: number;
  label: string;
};
type VocabData = {
  s: string;
  v: string;
};

export class MoveCardPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/deck',
    canBeDisabled: true,
    name: 'Move Cards',
    runAgain: true,
    enableText: 'Allow moving cards between decks',
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'objects',
      text: 'Target Decks',
      type: PluginUserOptionFieldType.OBJECTLIST,
      default: [],
      schema: [
        {
          key: 'deckId',
          label: 'Deck ID',
          type: PluginUserOptionFieldType.NUMBER,
          min: 1,
        },
        {
          key: 'label',
          label: 'Label',
          type: PluginUserOptionFieldType.TEXT,
        },
      ],
    },
  ];

  protected _currentDeckId: number;

  protected run(): void {
    if (this.isPremadeDeck()) return;

    this._currentDeckId = Number(this.QUERY['id']);

    const targets = this.getUsersSetting<DeckTarget[]>('objects', []).filter(
      ({ deckId }) => deckId !== this._currentDeckId,
    );

    this.renderTargets(targets);
  }

  protected isPremadeDeck(): boolean {
    return this._dom
      .findOne<'p'>('.container p')
      ?.innerText.startsWith('This deck was created from');
  }

  protected renderTargets(targets: DeckTarget[]): void {
    const selector = document.evaluate(
      // eslint-disable-next-line max-len
      './/*[contains(concat(" ",normalize-space(@class)," ")," dropdown-content ")]/ul/li[contains(.,"Edit meanings")]',
      this._dom.findOne('.vocabulary-list'),
      null,
      XPathResult.ANY_TYPE,
    );
    const domTargets: HTMLLIElement[] = [];
    let c: HTMLLIElement;

    while ((c = selector.iterateNext() as HTMLLIElement)) domTargets.push(c);

    domTargets.forEach((e) => {
      targets.forEach((target) => {
        const li = this._dom.adjacentNewElement('beforebegin', e, 'li');

        this._dom.appendNewElement(li, 'a', {
          innerText: `Move to: ${target.label}`,
          handler: () => {
            const vocabData = this.queryToObject<VocabData>(
              this._dom.findOne(e, 'a').getAttribute('href').split('?')[1],
            );

            this.moveDeck(vocabData, target);
          },
        });
      });
    });
  }

  private moveDeck(vocab: VocabData, target: DeckTarget): void {
    const addUrl = `https://jpdb.io/deck/${target.deckId}/add`;
    const remUrl = `https://jpdb.io/deck/${this._currentDeckId}/remove-from-deck`;
    const m = 'POST';
    const send = {
      v: Number(vocab.v),
      s: Number(vocab.s),
      origin: `/deck?id=${this._currentDeckId}`,
    };

    void JPDBRequest(m, addUrl, send)
      .then(() =>
        JPDBRequest(m, remUrl, {
          ...vocab,
          origin: `/deck?id=${this._currentDeckId}`,
        }),
      )
      .then(() => virtual_refresh());
  }
}
