import {
  LearningStatsAdditionalStats,
  LearningStatsDataNodes,
  LearningStatsPresentData,
} from './types';

export const renderMobileTable = (
  nodes: LearningStatsDataNodes,
  present: LearningStatsPresentData,
  additional: LearningStatsAdditionalStats,
  showAbsolutes: boolean,
  showMains: boolean,
): void => {
  const showLocked = additional.lockedWords + additional.lockedKanji > 0;
  const showK = present.kanjiTotal > 0;
  const showWI = present.wordsIndirectTotal > 0;
  const showKI = present.kanjiIndirectTotal > 0;

  const newVocab = additional.newVocab === 0 ? additional.new : additional.newVocab;
  const dueVocab = additional.dueVocab === 0 ? additional.due : additional.dueVocab;

  const showSum = present.wordsTotal !== additional.sumTotal;
  const showUpcomingSum = present.kanjiTotal !== 0;

  const content: DOMElementTagOptions<'table'> = {
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
          //#region Current Progress
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
          //#endregion
          //#region Locked Progress
          (showMains || showLocked) && {
            tag: 'tr',
            children: [
              { tag: 'th' },
              { tag: 'th', innerText: showMains ? 'New' : '' },
              { tag: 'th', innerText: showMains ? 'Due' : '' },
              { tag: 'th' },
              { tag: 'th', innerText: showLocked ? 'Locked' : '' },
            ],
          },
          (showMains || showLocked) && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Words' },
              { tag: 'td', class: 'green', innerText: showMains ? newVocab : '' },
              {
                tag: 'td',
                class: dueVocab > 0 ? 'red' : 'green',
                innerText: showMains ? dueVocab : '',
              },
              { tag: 'td' },
              { tag: 'td', class: 'opac', innerText: showLocked ? additional.lockedWords : '' },
            ],
          },
          (showMains || showLocked) &&
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', class: 'green', innerText: showMains ? additional.newKanji : '' },
                {
                  tag: 'td',
                  class: additional.dueKanji > 0 ? 'red' : 'green',
                  innerText: showMains ? additional.dueKanji : '',
                },
                { tag: 'td' },
                { tag: 'td', class: 'opac', innerText: showLocked ? additional.lockedKanji : '' },
              ],
            },
          (showMains || showLocked) &&
            showUpcomingSum && { tag: 'tr', class: 'sum-divider', children: [] },
          (showMains || showLocked) &&
            showUpcomingSum && {
              tag: 'tr',
              class: 'sum',
              children: [
                { tag: 'th' },
                { tag: 'td', class: 'green', innerText: showMains ? additional.new : '' },
                {
                  tag: 'td',
                  class: additional.due > 0 ? 'red' : 'green',
                  innerText: showMains ? additional.due : '',
                },
                { tag: 'td' },
                {
                  tag: 'td',
                  class: 'opac',
                  innerText: showLocked ? additional.lockedWords + additional.lockedKanji : '',
                },
              ],
            },
          (showMains || showLocked) && {
            tag: 'tr',
            children: [{ tag: 'th', innerHTML: '&nbsp;' }],
          },
          //#endregion
          //#region Absolutes
          showAbsolutes && {
            tag: 'tr',
            children: [
              { tag: 'th' },
              { tag: 'th', innerText: 'Total' },
              { tag: 'th', innerText: 'Progress' },
              { tag: 'th', innerText: 'Upcoming ' },
              { tag: 'th' },
            ],
          },
          showAbsolutes && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Words' },
              { tag: 'td', innerText: additional.wordsABS },
              { tag: 'td', innerText: additional.wordsProgress },
              { tag: 'td', innerText: additional.wordsUpcoming },
              { tag: 'td', class: 'opac', innerText: `${additional.wordsABSPercent}%` },
            ],
          },
          showAbsolutes &&
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', innerText: additional.kanjiABS },
                { tag: 'td', innerText: additional.kanjiProgress },
                { tag: 'td', innerText: additional.kanjiUpcoming },
                { tag: 'td', class: 'opac', innerText: `${additional.kanjiABSPercent}%` },
              ],
            },
          showAbsolutes && showSum && { tag: 'tr', class: 'sum-divider', children: [] },
          showAbsolutes &&
            showSum && {
              tag: 'tr',
              class: 'sum',
              children: [
                { tag: 'th' },
                { tag: 'td', innerText: additional.sumABS },
                { tag: 'td', innerText: additional.sumProgress },
                { tag: 'td', innerText: additional.sumUpcoming },
                { tag: 'td', class: 'opac', innerText: `${additional.sumABSPercent}%` },
              ],
            },
          showAbsolutes && {
            tag: 'tr',
            children: [{ tag: 'td', innerHTML: '&nbsp;' }],
          },
          //#endregion
          //#region End
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
          showMains && {
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
          //#endregion
        ],
      },
    ],
  };

  document.jpdb.adjacentElement(nodes.stats!, 'beforebegin', content);
};
