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
      description:
        // eslint-disable-next-line max-len
        'Display deck statistics, like new or learning cards, in a more compact way by including those stats into the present table',
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
          description: 'Shows totals of learning and known as well as some additional statistics',
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
    const [, ...rows] = document.jpdb.findElements<'tr'>(statsBody, 'tr');

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
        ? Number(nodes.nonRedundant.childNodes[1].nodeValue.trim())
        : 0,
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

    const upcomingNodeContents = nodes.upcoming.innerHTML
      .replace(/<\/?span( class="strong")?>/g, '')
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

    // Learning + Known (LK)
    result.wordsLK = present.wordsKnown + present.wordsLearning;
    result.wordsIndirectLK = present.wordsIndirectKnown + present.wordsIndirectLearning;
    result.kanjiLK = present.kanjiKnown + present.kanjiLearning;
    result.kanjiIndirectLK = present.kanjiIndirectKnown + present.kanjiIndirectLearning;
    result.sumLK =
      result.wordsLK + result.wordsIndirectLK + result.kanjiLK + result.kanjiIndirectLK;

    // New + Due + Locked (NDL)
    result.wordsNDL = result.newVocab + result.dueVocab + result.lockedWords;
    result.kanjiNDL = result.newKanji + result.dueKanji + result.lockedKanji;
    result.sumNDL = result.wordsNDL + result.kanjiNDL;

    result.wordsABS = result.wordsLK + result.wordsNDL;
    result.wordsIndirectABS = result.wordsIndirectLK;
    result.kanjiABS = result.kanjiLK + result.kanjiNDL;
    result.kanjiIndirectABS = result.kanjiIndirectLK;
    result.sumABS =
      result.wordsABS + result.wordsIndirectABS + result.kanjiABS + result.kanjiIndirectABS;

    result.wordsABSPercent = Math.floor((result.wordsLK / result.wordsABS) * 100);
    result.kanjiABSPercent = Math.floor((result.kanjiLK / result.kanjiABS) * 100);
    result.sumABSPercent = Math.floor((result.sumLK / result.sumABS) * 100);

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

      wordsLK: data.wordsLK ?? 0,
      wordsNDL: data.wordsNDL ?? 0,
      wordsABS: data.wordsABS ?? 0,
      wordsABSPercent: data.wordsABSPercent ?? 0,

      kanjiLK: data.kanjiLK ?? 0,
      kanjiNDL: data.kanjiNDL ?? 0,
      kanjiABS: data.kanjiABS ?? 0,
      kanjiABSPercent: data.kanjiABSPercent ?? 0,

      wordsIndirectLK: data.wordsIndirectLK ?? 0,
      wordsIndirectABS: data.wordsIndirectABS ?? 0,

      kanjiIndirectLK: data.kanjiIndirectLK ?? 0,
      kanjiIndirectABS: data.kanjiIndirectABS ?? 0,

      sumLK: data.sumLK ?? 0,
      sumNDL: data.sumNDL ?? 0,
      sumABS: data.sumABS ?? 0,
      sumABSPercent: data.sumABSPercent ?? 0,
    };
  }

  private appendNewCardsToday(): void {
    const showMains = !document.jpdb.findElement('.dropdown.right-aligned');
    const target = jpdb.settings.persistence.getModuleOption(this.LEARNING_STATS, this.SETTING, 20);

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
        if (today === '?') return;

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
    const showSmallTable = jpdb.settings.persistence.getModuleOption(
      this.LEARNING_STATS,
      'show-small-table',
      false,
    );
    const showAbsolutes = jpdb.settings.persistence.getModuleOption(
      this.LEARNING_STATS,
      'show-total-total',
      false,
    );
    // Search for Menu dropdown only existend on deck pages
    const showMains = !document.jpdb.findElement('.dropdown.right-aligned');

    if (isMobile() || showSmallTable) {
      return renderMobileTable(
        this.nodes,
        this.present,
        this.additional,
        showMains && showAbsolutes,
        showMains,
      );
    }

    renderDesktopTable(
      this.nodes,
      this.present,
      this.additional,
      showMains && showAbsolutes,
      showMains,
    );
  }
}

new LearningStats();
