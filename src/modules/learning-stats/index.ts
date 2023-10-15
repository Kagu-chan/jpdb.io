import { renderDesktopTable } from './render-desktop-table';
import { renderMobileTable } from './render-mobile-table';
import {
  LearningStatsAdditionalStats,
  LearningStatsDataNodes,
  LearningStatsPresentData,
} from './types';

export class LearningStats {
  private LEARNING_STATS: string = 'learning-stats';
  private SETTING: string = 'max-new-cards-per-day';

  private nodes: LearningStatsDataNodes;
  private present: LearningStatsPresentData;
  private additional: LearningStatsAdditionalStats;

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.LEARNING_STATS,
      category: 'Decks',
      displayText: 'Display deck statistics in one table',
      description: `
<div>Display deck statistics, like new or learning cards, in a more compact way by including those stats into the present table.</div>
<p>Due to how those stats are retrieved from the server, calculated stats are not accurate!</p>
`,
      options: [
        !isMobile() && {
          key: 'show-small-table',
          type: 'checkbox',
          text: 'Force small (mobile) table',
          description: 'Displays the same table as on mobile devices',
          default: false,
        },
        {
          key: 'show-total-total',
          type: 'checkbox',
          text: 'Show combined totals',
          // Learning [Learning + Due](Progress)
          // Upcoming [New + Locked](Upcoming)
          description:
            // eslint-disable-next-line max-len
            `<div style="margin-bottom:.5rem;">Shows some additional stats, which are as follows:</div>
<ul><li>Progress: Learning + Due</li>
<li>Upcoming: New + Locked</li>
<li>Sum of non-suspended Elements</li>
<li>Percentage of cards seen (Learning, Upcoming and known) out of non suspended elements</li></ul>`,
          default: false,
        },
      ],
    });
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable('/settings', this.LEARNING_STATS, () => {
      jpdb.settings.persistence.setModuleOption(
        this.LEARNING_STATS,
        this.SETTING,
        jpdb.settings.getJpdbSetting(this.SETTING),
      );
    });

    jpdb.runAlwaysWhenActive('/learn', this.LEARNING_STATS, () => {
      this.updateTable();
      this.removeHeader();
    });
    jpdb.runAlwaysWhenActive('/deck', this.LEARNING_STATS, () => {
      this.updateTable();
      this.removeHeader();
    });
    jpdb.runAlwaysWhenActive('/review', this.LEARNING_STATS, () =>
      jpdb.cache.invalidate(this.LEARNING_STATS, 'new'),
    );
  }

  private removeHeader(): void {
    document.jpdb.withElement('h4', (e) => e.remove());
  }

  private updateTable(): void {
    this.nodes = this.getDataNodes();
    this.present = this.getPresentStats();
    this.additional = this.getAdditionalStats();

    jpdb.css.add(this.LEARNING_STATS, __load_css('./src/modules/learning-stats/stats.css'));

    this.renderUpdatedTable();
    this.appendNewCardsToday();
    this.removeObsoleteNodes();
  }

  private getDataNodes(): LearningStatsDataNodes {
    const header =
      document.jpdb.findElement('h4') ||
      document.jpdb.findElement('div[style="margin-bottom: 1rem; display: flex;"]');
    const dataNodes: LearningStatsDataNodes = {
      container: header.nextSibling as HTMLDivElement,
      stats: undefined,
      statsBody: undefined,
      locked: undefined,
      lockedBody: undefined,
      nonRedundant: undefined,
      fulfilled: undefined,
      upcoming: undefined,
    };
    const [t1, t2] = document.jpdb.findElements<'table'>(dataNodes.container, 'table');
    const nextItem = dataNodes.container.nextSibling as HTMLParagraphElement;

    dataNodes.stats = t1;
    dataNodes.statsBody = document.jpdb.findElement<'tbody'>(t1, 'tbody');

    dataNodes.locked = t2;
    dataNodes.lockedBody = t2 && document.jpdb.findElement<'tbody'>(t2, 'tbody');

    dataNodes.nonRedundant = document.jpdb.findElement<'p'>(dataNodes.container, 'p');

    if (nextItem.innerText.startsWith("You've already")) {
      dataNodes.fulfilled = nextItem;
      dataNodes.upcoming = nextItem.nextSibling as HTMLParagraphElement;
    } else {
      dataNodes.upcoming = nextItem;
    }

    return dataNodes;
  }

  private getPresentStats(): LearningStatsPresentData {
    const { statsBody } = this.nodes;
    const data: Partial<LearningStatsPresentData> = {};
    const [, ...rows] = document.jpdb.findElements<'tr'>(statsBody!, 'tr');

    rows.forEach((r) => this.assignStatsFromRow(r, data));

    return this.fillEmptyPresentStats(data);
  }

  private getAdditionalStats(): LearningStatsAdditionalStats {
    const { present, nodes } = this;

    const sumTotal =
      present.wordsTotal +
      present.wordsIndirectTotal +
      present.kanjiTotal +
      present.kanjiIndirectTotal;
    const sumLearning =
      present.wordsLearning +
      present.wordsIndirectLearning +
      present.kanjiLearning +
      present.kanjiIndirectLearning;
    const sumKnown =
      present.wordsKnown +
      present.wordsIndirectKnown +
      present.kanjiKnown +
      present.kanjiIndirectKnown;
    const sumPercent = Math.floor((sumKnown / sumTotal) * 100);

    const result: Partial<LearningStatsAdditionalStats> = {
      sumTotal,
      sumLearning,
      sumKnown,
      sumPercent,

      nonRedundant: nodes.nonRedundant
        ? Number(nodes.nonRedundant.childNodes[1]!.nodeValue!.trim())
        : 0,

      lockedWords: 0,
      lockedKanji: 0,

      dueVocab: 0,
      dueKanji: 0,

      newVocab: 0,
      newKanji: 0,
    };

    if (nodes.lockedBody) {
      let lastText: string;

      document.jpdb.withElements<'td'>(nodes.lockedBody, 'td, th', (e: HTMLTableCellElement) => {
        if (e.innerText.includes('Locked')) {
          lastText = e.innerText.includes('words') ? 'lockedWords' : 'lockedKanji';

          return;
        }

        result[lastText as keyof LearningStatsAdditionalStats] = Number(e.innerText);
      });
    }

    const upcomingNodeContents = nodes
      .upcoming!.innerHTML.replace(/<\/?span( class="strong")?>/g, '')
      .replace(/\&nbsp\;/g, ' ');
    const hasParatheses = upcomingNodeContents.includes('(');

    result.due = Number(upcomingNodeContents.match(/(\d+) due/)?.[1] ?? 0);
    result.new = Number(upcomingNodeContents.match(/(\d+) new/)?.[1] ?? 0);

    if (hasParatheses) {
      const nodes = upcomingNodeContents.split('new items');
      const dueC = nodes.length === 2 ? nodes[0] : undefined;
      const newC = nodes.length === 2 ? nodes[1] : nodes[0];

      if (dueC) {
        result.dueVocab = Number(dueC.match(/(\d+) voc/)?.[1] ?? 0);
        result.dueKanji = Number(dueC.match(/(\d+) kan/)?.[1] ?? 0);
      }

      if (newC) {
        result.newVocab = Number(newC.match(/(\d+) voc/)?.[1] ?? 0);
        result.newKanji = Number(newC.match(/(\d+) kan/)?.[1] ?? 0);
      }
    }

    // Learning [Learning + Due](Progress)
    result.wordsProgress =
      present.wordsLearning +
      present.wordsIndirectLearning +
      (!!result.dueVocab ? result.dueVocab : result.due);
    result.kanjiProgress = present.kanjiLearning + present.kanjiIndirectLearning + result.dueKanji!;
    result.sumProgress = result.wordsProgress + result.kanjiProgress;

    // Upcoming [New + Locked](Upcoming)
    result.wordsUpcoming = result.newVocab! + result.lockedWords!;
    result.kanjiUpcoming = result.newKanji! + result.lockedKanji!;
    result.sumUpcoming = result.wordsUpcoming + result.kanjiUpcoming;

    result.wordsABS =
      result.wordsProgress + result.wordsUpcoming + present.wordsKnown + present.wordsIndirectKnown;
    result.kanjiABS =
      result.kanjiProgress + result.kanjiUpcoming + present.kanjiKnown + present.kanjiIndirectKnown;
    result.sumABS = result.wordsABS + result.kanjiABS;

    result.wordsABSPercent = Math.floor(
      ((result.wordsProgress + present.wordsKnown + present.wordsIndirectKnown) / result.wordsABS) *
        100,
    );
    result.kanjiABSPercent = Math.floor(
      ((result.kanjiProgress + present.kanjiKnown + present.kanjiIndirectKnown) / result.kanjiABS) *
        100,
    );
    result.sumABSPercent = Math.floor(
      ((result.sumProgress + (result.sumKnown ?? 0)) / result.sumABS) * 100,
    );

    return this.fillEmptyAdditionalStats(result);
  }

  private assignStatsFromRow(
    row: HTMLTableRowElement,
    target: Partial<LearningStatsPresentData>,
  ): void {
    const [key, t, l, k] = document.jpdb.findElements<'td'>(row, 'td').map((e) => e.innerText);
    const prefix =
      key === 'Words'
        ? 'words'
        : key.startsWith('Words')
        ? key.includes('(indirect)')
          ? 'wordsIndirect'
          : 'words'
        : key.includes('(indirect)')
        ? 'kanjiIndirect'
        : 'kanji';

    const total = Number(t);
    const learning = Number(l);

    const [kt, pt] = k.split('(');
    const known = Number(kt.replace(/[^\d]+/g, ''));
    const percent = Number(pt.replace(/[^\d]+/g, ''));

    Object.assign(target, {
      [`${prefix}Total`]: total,
      [`${prefix}Learning`]: learning,
      [`${prefix}Known`]: known,
      [`${prefix}Percent`]: percent,
    });
  }

  private fillEmptyPresentStats(data: Partial<LearningStatsPresentData>): LearningStatsPresentData {
    return {
      wordsTotal: data.wordsTotal ?? 0,
      wordsLearning: data.wordsLearning ?? 0,
      wordsKnown: data.wordsKnown ?? 0,
      wordsPercent: data.wordsPercent ?? 0,
      kanjiTotal: data.kanjiTotal ?? 0,
      kanjiLearning: data.kanjiLearning ?? 0,
      kanjiKnown: data.kanjiKnown ?? 0,
      kanjiPercent: data.kanjiPercent ?? 0,
      wordsIndirectTotal: data.wordsIndirectTotal ?? 0,
      wordsIndirectLearning: data.wordsIndirectLearning ?? 0,
      wordsIndirectKnown: data.wordsIndirectKnown ?? 0,
      wordsIndirectPercent: data.wordsIndirectPercent ?? 0,
      kanjiIndirectTotal: data.kanjiIndirectTotal ?? 0,
      kanjiIndirectLearning: data.kanjiIndirectLearning ?? 0,
      kanjiIndirectKnown: data.kanjiIndirectKnown ?? 0,
      kanjiIndirectPercent: data.kanjiIndirectPercent ?? 0,
    };
  }

  private fillEmptyAdditionalStats(
    data: Partial<LearningStatsAdditionalStats>,
  ): LearningStatsAdditionalStats {
    return {
      sumTotal: data.sumTotal ?? 0,
      sumLearning: data.sumLearning ?? 0,
      sumKnown: data.sumKnown ?? 0,
      sumPercent: data.sumPercent ?? 0,

      lockedWords: data.lockedWords ?? 0,
      lockedKanji: data.lockedKanji ?? 0,

      nonRedundant: data.nonRedundant ?? 0,

      due: data.due ?? 0,
      dueVocab: data.dueVocab ?? 0,
      dueKanji: data.dueKanji ?? 0,

      new: data.new ?? 0,
      newVocab: data.newVocab ?? 0,
      newKanji: data.newKanji ?? 0,

      wordsProgress: data.wordsProgress ?? 0,
      wordsUpcoming: data.wordsUpcoming ?? 0,
      wordsABS: data.wordsABS ?? 0,
      wordsABSPercent: data.wordsABSPercent ?? 0,

      kanjiProgress: data.kanjiProgress ?? 0,
      kanjiUpcoming: data.kanjiUpcoming ?? 0,
      kanjiABS: data.kanjiABS ?? 0,
      kanjiABSPercent: data.kanjiABSPercent ?? 0,

      sumProgress: data.sumProgress ?? 0,
      sumUpcoming: data.sumUpcoming ?? 0,
      sumABS: data.sumABS ?? 0,
      sumABSPercent: data.sumABSPercent ?? 0,
    };
  }

  private appendNewCardsToday(): void {
    const showMains = !document.jpdb.findElement('.dropdown.right-aligned');
    const target = jpdb.settings.persistence.getModuleOption<number>(
      this.LEARNING_STATS,
      this.SETTING,
    );

    if (!showMains) {
      return;
    }

    void jpdb.cache
      .fromCacheAsync<string>(
        this.LEARNING_STATS,
        'new',
        60,
        (): Promise<string> =>
          xhrAsync('GET', '/stats', {}).then(([, responseText]) => {
            const [, part1] = responseText.split('New cards');
            const [part2] = part1?.split('] }, ] };');
            const [lastNewCardsVal] = part2?.split(',')?.reverse() ?? [];

            return lastNewCardsVal ?? '?';
          }),
      )
      .then((today: string) => {
        if (today === '?') {
          return;
        }

        document.jpdb.findElement('.new-today').classList.toggle('hidden');
        document.jpdb.findElement('.new-today-stats').innerText = `${today} / ${target}`;
        document.jpdb.findElement('.new-today-percent').innerText = `${Math.floor(
          (Number(today) / target) * 100,
        )}%`;
      });
  }

  private removeObsoleteNodes(): void {
    this.nodes.stats?.remove();
    this.nodes.locked?.remove();
    this.nodes.nonRedundant?.remove();
    this.nodes.fulfilled?.remove();
    this.nodes.upcoming?.remove();
  }

  private renderUpdatedTable(): void {
    const showSmallTable = jpdb.settings.persistence.getModuleOption<boolean>(
      this.LEARNING_STATS,
      'show-small-table',
    );
    const showAbsolutes = jpdb.settings.persistence.getModuleOption<boolean>(
      this.LEARNING_STATS,
      'show-total-total',
    );
    // Search for Menu dropdown only existend on deck pages
    const showMains = !document.jpdb.findElement('.dropdown.right-aligned');

    if (isMobile() || showSmallTable) {
      return renderMobileTable(this.nodes, this.present, this.additional, showAbsolutes, showMains);
    }

    renderDesktopTable(this.nodes, this.present, this.additional, showAbsolutes, showMains);
  }
}

new LearningStats();
