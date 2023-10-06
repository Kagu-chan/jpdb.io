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
          //#endregion
          //#region Absolutes
          showAbsolutes && {
            tag: 'tr',
            children: [
              { tag: 'th' },
              { tag: 'th', innerText: 'Total' },
              { tag: 'th', innerText: 'In Progress' },
              { tag: 'th', innerText: 'Upcoming ' },
              { tag: 'th' },
            ],
          },
          showAbsolutes && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Words' },
              { tag: 'td', innerText: additional.wordsABS },
              { tag: 'td', innerText: additional.wordsLK },
              { tag: 'td', innerText: additional.wordsNDL },
              { tag: 'td', class: 'opac', innerText: `${additional.wordsABSPercent}%` },
            ],
          },
          showAbsolutes &&
            showWI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Words (indirect)' },
                { tag: 'td' },
                { tag: 'td', innerText: additional.wordsIndirectLK },
                { tag: 'td' },
                { tag: 'td' },
              ],
            },
          showAbsolutes &&
            showK && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji' },
                { tag: 'td', innerText: additional.kanjiABS },
                { tag: 'td', innerText: additional.kanjiLK },
                { tag: 'td', innerText: additional.kanjiNDL },
                { tag: 'td', class: 'opac', innerText: `${additional.kanjiABSPercent}%` },
              ],
            },
          showAbsolutes &&
            showKI && {
              tag: 'tr',
              children: [
                { tag: 'th', innerText: 'Kanji (indirect)' },
                { tag: 'td' },
                { tag: 'td', innerText: additional.kanjiIndirectLK },
                { tag: 'td' },
                { tag: 'td' },
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
                { tag: 'td', innerText: additional.sumLK },
                { tag: 'td', innerText: additional.sumNDL },
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
  });
};
