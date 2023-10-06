import { JPDBPlugin } from '../plugin/jpdb-plugin';
import { PluginOptions } from '../plugin/types/plugin-options';
import { PluginUserOptions, PluginUserOptionFieldType } from '../plugin/types/plugin-user-options';
import { JPDBRequest } from '../request';

interface DeckTarget {
  deckId: number;
  label: string;
}
interface VocabData {
  s: string;
  v: string;
}

export class MoveCardPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/deck',
    canBeDisabled: true,
    name: 'Move Cards',
    runAgain: true,
    enableText: 'Allow moving cards between decks',
    description: 'Adds a `Move card` option to the menu of single vocab cards',
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
    if (this.isPremadeDeck()) {
      return;
    }

    this._currentDeckId = Number(5);
    // this._currentDeckId = Number(this.QUERY['id']);

    const targets = this.getUsersSetting<DeckTarget[]>('objects').filter(
      ({ deckId }) => deckId !== this._currentDeckId,
    );

    this.renderTargets(targets);
  }

  protected isPremadeDeck(): boolean {
    return document.jpdb
      .findElement('.container p')
      ?.innerText.startsWith('This deck was created from');
  }

  protected renderTargets(targets: DeckTarget[]): void {
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
              innerText: `Move to: ${target.label}`,
              handler: (): void => {
                const vocabData: VocabData = {} as unknown as VocabData;
                //  this.queryToObject<VocabData>(
                //   document.jpdb.findElement(e, 'a').getAttribute('href').split('?')[1],
                // );

                this.moveDeck(vocabData, target);
              },
            },
          ],
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
