import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import {
  PluginOptions,
  PluginUserOptionDependencyAction,
  PluginUserOptionFieldType,
  PluginUserOptions,
} from '../lib/types';

type LearningState = 'low' | 'at' | 'high';
type LearningMeta = {
  total: number;
  learning: number;
  known: number;
};

export class LearningStatsPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/learn',
    canBeDisabled: true,
    name: 'Learning Statistics',
    runAgain: true,
    enableText: 'Show additional learning stats',
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'enable-learning-limit',
      type: PluginUserOptionFieldType.CHECKBOX,
      text: 'Add learning limit',
      description:
        'This displays only a warning, when you`re about to have too many cards in learning state',
    },
    {
      key: 'learning-limit',
      type: PluginUserOptionFieldType.NUMBER,
      min: 1,
      hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
      indent: false,
      dependsOn: 'enable-learning-limit',
      text: 'How many cards should be in learning state max',
    },
  ];

  private _lNode: HTMLTableCellElement;

  protected run(): void {
    const table = this._dom.findOne<'table'>(
      '.cross-table.label-right-align.data-right-align.label-big-padding.small-header tbody',
    );
    const rows = this._dom.find<'tr'>(table, 'tr:not(:first-of-type)');
    const meta: LearningMeta = { total: 0, learning: 0, known: 0 };

    rows.forEach((row) => {
      const [, total, learning, known] = this._dom.find(row, 'td');

      meta.total += Number(total.innerText);
      meta.learning += Number(learning.innerText);
      meta.known += Number(known.innerText.split(/(&nbsp;)|\s/)[0]);
    });

    this.addTotalRow(table, meta);
    this.addFinalRow(table, meta);

    if (
      this.getUsersSetting<boolean>('enable-learning-limit') &&
      this.getUsersSetting<number>('learning-limit') > 0
    ) {
      this.showLearningLimit(meta);
    }
  }

  private addTotalRow(tab: HTMLTableElement, meta: LearningMeta): void {
    const pct = Math.round(meta.known / meta.total);
    const tr = this._dom.appendNewElement(tab, 'tr');

    this._dom.appendNewElement(tr, 'td', { innerText: 'Total' });
    this._dom.appendNewElement(tr, 'td', { innerText: String(meta.total) });

    this._lNode = this._dom.appendNewElement(tr, 'td', { innerText: String(meta.learning) });

    this._dom.appendNewElement(tr, 'td', { innerText: `${meta.known} (${pct}%)` });

    tab.append(tr);
  }

  private addFinalRow(tab: HTMLTableElement, meta: LearningMeta): void {
    const thisTotal = meta.learning + meta.known;
    const tr = this._dom.appendNewElement(tab, 'tr');

    this._dom.appendNewElement(tr, 'td', { innerText: 'Seen' });
    this._dom.appendNewElement(tr, 'td', {
      innerText: String(thisTotal),
      style: { color: 'var(--table-header-color)' },
    });

    this._dom.appendNewElement(tr, 'td');
    this._dom.appendNewElement(tr, 'td');
  }

  private showLearningLimit({ learning }: LearningMeta): void {
    const maxLearning = this.getUsersSetting<number>('learning-limit');
    const state: LearningState =
      learning > maxLearning ? 'high' : learning < maxLearning ? 'low' : 'at';

    switch (state) {
      case 'low':
        this._lNode.style.color = 'orange';
        break;
      case 'high':
        this._lNode.style.color = 'red';
        break;
      case 'at':
        this._lNode.style.color = 'green';
        break;
    }

    this.addLearningNote(learning, maxLearning, state);
  }

  private addLearningNote(learning: number, max: number, state: LearningState): void {
    const fulfilledNode = this._dom.findOne<'p'>('.container.bugfix > p');
    const adjacentTarget = this._dom.findOne<'div'>('.container.bugfix > div');

    if (fulfilledNode.innerText.startsWith("You've already")) {
      return this.modifyExistingNode(fulfilledNode, learning, max, state);
    }

    const newP = this._dom.adjacentNewElement('afterend', adjacentTarget, 'p', {
      style: { opacity: '.6', fontStyle: 'italic' },
    });
    let text: string;

    switch (state) {
      case 'high':
        text = `You have overdone your target of ${max} learning cards (${learning} learning), even though you haven\'t completed your daily new cards quota.`;
        newP.style.color = 'red';
        newP.style.opacity = '1';

        break;
      case 'at':
        text = `You have reached your target of ${max} learning cards, even though you haven\'t completed your daily new cards quota.`;

        break;
      case 'low':
        text = `You have neither reached your daily new cards quota nor your target of ${max} learning cards.`;
        newP.style.color = 'orange';

        break;
    }

    newP.innerText = text;
  }

  private modifyExistingNode(
    node: HTMLParagraphElement,
    learning: number,
    max: number,
    state: LearningState,
  ): void {
    let addText: string;

    node.style.opacity = '0.6';
    node.style.fontStyle = 'italic';

    switch (state) {
      case 'high':
        addText = `and overdone your target of ${max} learning cards (${learning} learning).`;
        node.style.color = 'red';
        node.style.opacity = '1';

        break;
      case 'at':
        addText = `and reached your target of ${max} learning cards.`;

        break;
      case 'low':
        addText = `but have not yet reached your target of ${max} learning cards.`;
        node.style.color = 'orange';

        break;
    }

    node.innerText = `${node.innerText.replace(/\.$/, '')} ${addText}`;

    return;
  }
}
