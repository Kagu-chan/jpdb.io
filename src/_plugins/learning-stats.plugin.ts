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
    const table: HTMLTableElement = document.jpdb.findElement<'table'>(
      '.cross-table.label-right-align.data-right-align.label-big-padding.small-header tbody',
    );
    const rows: HTMLTableRowElement[] = document.jpdb.findElements<'tr'>(
      table,
      'tr:not(:first-of-type)',
    );
    const meta: LearningMeta = { total: 0, learning: 0, known: 0 };

    rows.forEach((row) => {
      const [, total, learning, known] = document.jpdb.findElements<'td'>(row, 'td');

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
    const row = document.jpdb.appendElement(tab, {
      tag: 'tr',
      children: [
        { tag: 'td', innerText: 'Total' },
        { tag: 'td', innerText: String(meta.total) },
        { tag: 'td', innerText: String(meta.learning) },
        { tag: 'td', innerText: `${meta.known} (${pct}%)` },
      ],
    });

    this._lNode = row.children.item(2) as HTMLTableCellElement;
  }

  private addFinalRow(tab: HTMLTableElement, meta: LearningMeta): void {
    const thisTotal = meta.learning + meta.known;

    document.jpdb.appendElement(tab, {
      tag: 'tr',
      children: [
        { tag: 'td', innerText: 'Seen' },
        {
          tag: 'td',
          innerText: String(thisTotal),
          style: { color: 'var(--table-header-color)' },
        },
        { tag: 'td' },
        { tag: 'td' },
      ],
    });
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
    const fulfilledNode = document.jpdb.findElement<'p'>('.container.bugfix > p');
    const adjacentTarget = document.jpdb.findElement<'div'>('.container.bugfix > div');

    if (fulfilledNode.innerText.startsWith("You've already")) {
      return this.modifyExistingNode(fulfilledNode, learning, max, state);
    }

    const newP = document.jpdb.adjacentElement(adjacentTarget, 'afterend', {
      tag: 'p',
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
