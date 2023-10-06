import {
  LearningStatsAdditionalStats,
  LearningStatsDataNodes,
  LearningStatsPresentData,
} from './types';

export const renderDesktopTable = (
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
              showAbsolutes && { tag: 'th' },
              showLocked && { tag: 'th', innerText: 'Locked' },
              { tag: 'th', innerText: 'New' },
              { tag: 'th', innerText: 'Due' },
              showAbsolutes && { tag: 'th' },
              { tag: 'th', innerText: 'Learning' },
              { tag: 'th', innerText: 'Known' },
              showAbsolutes && { tag: 'th' },
              { tag: 'th' },
              showAbsolutes && { tag: 'td' },
            ],
          },
          {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Words' },
              { tag: 'td', innerText: present.wordsTotal },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.wordsABS})`,
              },
              showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedWords },
              { tag: 'td', class: 'green', innerText: additional.newVocab },
              { tag: 'td', class: dueVocab > 0 ? 'red' : 'green', innerText: dueVocab },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.wordsNDL})`,
              },
              { tag: 'td', innerText: present.wordsLearning },
              { tag: 'td', innerText: present.wordsKnown },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.wordsLK})`,
              },
              { tag: 'td', innerText: `${present.wordsPercent}%` },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.wordsABSPercent}%)`,
              },
            ],
          },
          showWI && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Words (indirect)' },
              { tag: 'td', innerText: present.wordsIndirectTotal },
              showAbsolutes && { tag: 'td' },
              showLocked && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td', innerText: present.wordsIndirectLearning },
              { tag: 'td', innerText: present.wordsIndirectKnown },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.wordsIndirectLK})`,
              },
              { tag: 'td', innerText: `${present.wordsIndirectPercent}%` },
              showAbsolutes && { tag: 'td' },
            ],
          },
          showK && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Kanji' },
              { tag: 'td', innerText: present.kanjiTotal },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.kanjiABS})`,
              },
              showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedKanji },
              { tag: 'td', class: 'green', innerText: additional.newKanji },
              {
                tag: 'td',
                class: additional.dueKanji > 0 ? 'red' : 'green',
                innerText: additional.dueKanji,
              },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.kanjiNDL})`,
              },
              { tag: 'td', innerText: present.kanjiLearning },
              { tag: 'td', innerText: present.kanjiKnown },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.kanjiLK})`,
              },
              { tag: 'td', innerText: `${present.kanjiPercent}%` },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.kanjiABSPercent}%)`,
              },
            ],
          },
          showKI && {
            tag: 'tr',
            children: [
              { tag: 'th', innerText: 'Kanji (indirect)' },
              { tag: 'td', innerText: present.kanjiIndirectTotal },
              showAbsolutes && { tag: 'td' },
              showLocked && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td', innerText: present.kanjiIndirectLearning },
              { tag: 'td', innerText: present.kanjiIndirectKnown },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.kanjiIndirectLK})`,
              },
              { tag: 'td', innerText: `${present.kanjiIndirectPercent}%` },
              showAbsolutes && { tag: 'td' },
            ],
          },
          showSum && { tag: 'tr', class: 'sum-divider', children: [] },
          showSum && {
            tag: 'tr',
            class: 'sum',
            children: [
              { tag: 'th' },
              { tag: 'td', innerText: additional.sumTotal },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.sumABS})`,
              },
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
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.sumNDL})`,
              },
              { tag: 'td', innerText: additional.sumLearning },
              { tag: 'td', innerText: additional.sumKnown },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.sumLK})`,
              },
              { tag: 'td', innerText: `${additional.sumPercent}%` },
              showAbsolutes && {
                tag: 'td',
                class: ['opac', 'sm'],
                innerText: `(${additional.sumABSPercent}%)`,
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
              showAbsolutes && { tag: 'td' },
              showLocked && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
            ],
          },
          showMains && {
            tag: 'tr',
            class: ['hidden', 'new-today'],
            children: [
              { tag: 'th', innerText: 'New today' },
              { tag: 'td', class: 'new-today-stats', innerText: '${today} / ${target}' },
              showAbsolutes && { tag: 'td' },
              showLocked && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td', class: 'new-today-percent', innerText: '0%' },
              showAbsolutes && { tag: 'td' },
            ],
          },
        ],
      },
    ],
  });
};
