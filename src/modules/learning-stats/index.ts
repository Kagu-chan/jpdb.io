// TODO: A total toal should be added.
// This contains all learning and to review cards, also a second row for all locked + new, a third row for the total
// Should be toggleable
interface LearningStatsDataNodes {
  container: HTMLDivElement;
  stats: HTMLTableElement;
  locked: HTMLTableElement;
  statsBody: HTMLTableSectionElement;
  lockedBody: HTMLTableSectionElement;
  nonRedundant: HTMLParagraphElement;
  fulfilled: HTMLParagraphElement;
  upcoming: HTMLParagraphElement;
}

interface LearningStatsPresentData {
  wordsTotal: number;
  wordsLearning: number;
  wordsKnown: number;
  wordsPercent: number;
  kanjiTotal: number;
  kanjiLearning: number;
  kanjiKnown: number;
  kanjiPercent: number;
  wordsIndirectTotal: number;
  wordsIndirectLearning: number;
  wordsIndirectKnown: number;
  wordsIndirectPercent: number;
  kanjiIndirectTotal: number;
  kanjiIndirectLearning: number;
  kanjiIndirectKnown: number;
  kanjiIndirectPercent: number;
}

interface LearningStatsAdditionalStats {
  sumTotal: number;
  sumLearning: number;
  sumKnown: number;
  sumPercent: number;

  lockedWords: number;
  lockedKanji: number;

  nonRedundant: number;

  due: number;
  dueVocab: number;
  dueKanji: number;

  new: number;
  newVocab: number;
  newKanji: number;
}

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

    jpdb.runAlwaysWhenActive('/learn', this.LEARNING_STATS, () => this.updateTable());
    jpdb.runAlwaysWhenActive('/review', this.LEARNING_STATS, () =>
      jpdb.cache.invalidate(this.LEARNING_STATS, 'new'),
    );
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
    const header = document.jpdb.findElement('h4');
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
    const sumPercent = Math.ceil((sumKnown / sumTotal) * 100);

    const result: Partial<LearningStatsAdditionalStats> = {
      sumTotal,
      sumLearning,
      sumKnown,
      sumPercent,

      nonRedundant: Number(nodes.nonRedundant.childNodes[1].nodeValue.trim()),
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
    };
  }

  private appendNewCardsToday(): void {
    const target = jpdb.settings.persistence.getModuleOption(this.LEARNING_STATS, this.SETTING, 20);

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
        document.jpdb.findElement('.new-today-percent').innerText = `${Math.ceil(
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
    if (
      isMobile() ||
      jpdb.settings.persistence.getModuleOption(this.LEARNING_STATS, 'show-small-table', false)
    ) {
      return this.renderMobileTable();
    }

    this.renderDesktopTable();
  }

  private renderMobileTable(): void {
    const { nodes, present, additional } = this;

    const showLocked = !!nodes.locked && additional.lockedKanji > 0 && additional.lockedWords > 0;
    const showK = present.kanjiTotal > 0;
    const showWI = present.wordsIndirectTotal > 0;
    const showKI = present.kanjiIndirectTotal > 0;

    const newVocab = additional.newVocab === 0 ? additional.new : additional.newVocab;
    const dueVocab = additional.dueVocab === 0 ? additional.due : additional.dueVocab;

    const showSum = present.wordsTotal !== additional.sumTotal;
    const showUpcomingSum = present.kanjiTotal !== 0;

    document.jpdb.adjacentElement(nodes.stats, 'beforebegin', {
      tag: 'table',
      class: [
        'cross-table',
        'label-right-align',
        'data-right-align',
        'label-big-padding',
        'small-header',
        'learning-stats',
      ],
      children: [
        {
          tag: 'tbody',
          children: [
            {
              tag: 'tr',
              children: [
                { tag: 'th' },
                { tag: 'th', innerText: 'Total' },
                { tag: 'th', innerText: 'Learning' },
                { tag: 'th', innerText: 'Known' },
                { tag: 'th' },
              ],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words' },
                { tag: 'td', innerText: present.wordsTotal },
                { tag: 'td', innerText: present.wordsLearning },
                { tag: 'td', innerText: present.wordsKnown },
                { tag: 'td', innerText: `${present.wordsPercent}%` },
              ],
            },
            showWI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words (indirect)' },
                { tag: 'td', innerText: present.wordsIndirectTotal },
                { tag: 'td', innerText: present.wordsIndirectLearning },
                { tag: 'td', innerText: present.wordsIndirectKnown },
                { tag: 'td', innerText: `${present.wordsIndirectPercent}%` },
              ],
            },
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', innerText: present.kanjiTotal },
                { tag: 'td', innerText: present.kanjiLearning },
                { tag: 'td', innerText: present.kanjiKnown },
                { tag: 'td', innerText: `${present.kanjiPercent}%` },
              ],
            },
            showKI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji (indirect)' },
                { tag: 'td', innerText: present.kanjiIndirectTotal },
                { tag: 'td', innerText: present.kanjiIndirectLearning },
                { tag: 'td', innerText: present.kanjiIndirectKnown },
                { tag: 'td', innerText: `${present.kanjiIndirectPercent}%` },
              ],
            },
            showSum && { tag: 'tr', class: 'sum-divider', children: [] },
            showSum && {
              tag: 'tr',
              class: 'sum',
              children: [
                { tag: 'th' },
                { tag: 'td', innerText: additional.sumTotal },
                { tag: 'td', innerText: additional.sumLearning },
                { tag: 'td', innerText: additional.sumKnown },
                { tag: 'td', innerText: `${additional.sumPercent}%` },
              ],
            },
            {
              tag: 'tr',
              children: [{ tag: 'td', innerHTML: '&nbsp;' }],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th' },
                { tag: 'th', innerText: 'New' },
                { tag: 'th', innerText: 'Due' },
                { tag: 'th' },
                { tag: 'th', innerText: showLocked ? 'Locked' : '' },
              ],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words' },
                { tag: 'td', class: 'green', innerText: newVocab },
                { tag: 'td', class: dueVocab > 0 ? 'red' : 'green', innerText: dueVocab },
                { tag: 'td' },
                { tag: 'td', class: 'opac', innerText: showLocked ? additional.lockedWords : '' },
              ],
            },
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', class: 'green', innerText: additional.newKanji },
                {
                  tag: 'td',
                  class: additional.dueKanji > 0 ? 'red' : 'green',
                  innerText: additional.dueKanji,
                },
                { tag: 'td' },
                { tag: 'td', class: 'opac', innerText: showLocked ? additional.lockedKanji : '' },
              ],
            },
            showUpcomingSum && { tag: 'tr', class: 'sum-divider', children: [] },
            showUpcomingSum && {
              tag: 'tr',
              class: 'sum',
              children: [
                { tag: 'th' },
                { tag: 'td', class: 'green', innerText: additional.new },
                {
                  tag: 'td',
                  class: additional.due > 0 ? 'red' : 'green',
                  innerText: additional.due,
                },
                { tag: 'td' },
                {
                  tag: 'td',
                  class: 'opac',
                  innerText: showLocked ? additional.lockedWords + additional.lockedKanji : '',
                },
              ],
            },
            {
              tag: 'tr',
              children: [{ tag: 'th', innerHTML: '&nbsp;' }],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Non-redundant' },
                { tag: 'td', innerText: additional.nonRedundant },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
              ],
            },
            {
              tag: 'tr',
              class: ['hidden', 'new-today'],
              children: [
                { tag: 'th', innerText: 'New today' },
                { tag: 'td', class: 'new-today-stats', innerText: '${today} / ${target}' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td', class: 'new-today-percent', innerText: '0%' },
              ],
            },
          ],
        },
      ],
    });
  }

  private renderDesktopTable(): void {
    const { nodes, present, additional } = this;

    const showLocked = !!nodes.locked && additional.lockedKanji > 0 && additional.lockedWords > 0;
    const showK = present.kanjiTotal > 0;
    const showWI = present.wordsIndirectTotal > 0;
    const showKI = present.kanjiIndirectTotal > 0;

    const dueVocab = additional.dueVocab === 0 ? additional.due : additional.dueVocab;

    const showSum = present.wordsTotal !== additional.sumTotal;

    document.jpdb.adjacentElement(nodes.stats, 'beforebegin', {
      tag: 'table',
      class: [
        'cross-table',
        'label-right-align',
        'data-right-align',
        'label-big-padding',
        'small-header',
        'learning-stats',
      ],
      children: [
        {
          tag: 'tbody',
          children: [
            {
              tag: 'tr',
              children: [
                { tag: 'th' },
                { tag: 'th', innerText: 'Total' },
                showLocked && { tag: 'th', innerText: 'Locked' },
                { tag: 'th', innerText: 'New' },
                { tag: 'th', innerText: 'Due' },
                { tag: 'th', innerText: 'Learning' },
                { tag: 'th', innerText: 'Known' },
                { tag: 'th' },
              ],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words' },
                { tag: 'td', innerText: present.wordsTotal },
                showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedWords },
                { tag: 'td', class: 'green', innerText: additional.newVocab },
                { tag: 'td', class: dueVocab > 0 ? 'red' : 'green', innerText: dueVocab },
                { tag: 'td', innerText: present.wordsLearning },
                { tag: 'td', innerText: present.wordsKnown },
                { tag: 'td', innerText: `${present.wordsPercent}%` },
              ],
            },
            showWI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words (indirect)' },
                { tag: 'td', innerText: present.wordsIndirectTotal },
                showLocked && { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td', innerText: present.wordsIndirectLearning },
                { tag: 'td', innerText: present.wordsIndirectKnown },
                { tag: 'td', innerText: `${present.wordsIndirectPercent}%` },
              ],
            },
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', innerText: present.kanjiTotal },
                showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedKanji },
                { tag: 'td', class: 'green', innerText: additional.newKanji },
                {
                  tag: 'td',
                  class: additional.dueKanji > 0 ? 'red' : 'green',
                  innerText: additional.dueKanji,
                },
                { tag: 'td', innerText: present.kanjiLearning },
                { tag: 'td', innerText: present.kanjiKnown },
                { tag: 'td', innerText: `${present.kanjiPercent}%` },
              ],
            },
            showKI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji (indirect)' },
                { tag: 'td', innerText: present.kanjiIndirectTotal },
                showLocked && { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td', innerText: present.kanjiIndirectLearning },
                { tag: 'td', innerText: present.kanjiIndirectKnown },
                { tag: 'td', innerText: `${present.kanjiIndirectPercent}%` },
              ],
            },
            showSum && { tag: 'tr', class: 'sum-divider', children: [] },
            showSum && {
              tag: 'tr',
              class: 'sum',
              children: [
                { tag: 'th' },
                { tag: 'td', innerText: additional.sumTotal },
                showLocked && {
                  tag: 'td',
                  class: 'opac',
                  innerText: additional.lockedKanji + additional.lockedWords,
                },
                { tag: 'td', class: 'green', innerText: additional.new },
                {
                  tag: 'td',
                  class: additional.due > 0 ? 'red' : 'green',
                  innerText: additional.due,
                },
                { tag: 'td', innerText: additional.sumLearning },
                { tag: 'td', innerText: additional.sumKnown },
                { tag: 'td', innerText: `${additional.sumPercent}%` },
              ],
            },
            {
              tag: 'tr',
              children: [{ tag: 'th', innerHTML: '&nbsp;' }],
            },
            {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Non-redundant' },
                { tag: 'td', innerText: additional.nonRedundant },
                showLocked && { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
              ],
            },
            {
              tag: 'tr',
              class: ['hidden', 'new-today'],
              children: [
                { tag: 'th', innerText: 'New today' },
                { tag: 'td', class: 'new-today-stats', innerText: '${today} / ${target}' },
                showLocked && { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td' },
                { tag: 'td', class: 'new-today-percent', innerText: '0%' },
              ],
            },
          ],
        },
      ],
    });
  }
}

new LearningStats();
