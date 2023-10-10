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
  const showLocked = additional.lockedWords + additional.lockedKanji > 0;
  const showK = present.kanjiTotal > 0;
  const showWI = present.wordsIndirectTotal > 0;
  const showKI = present.kanjiIndirectTotal > 0;

  const dueVocab = additional.dueVocab === 0 ? additional.due : additional.dueVocab;

  const showSum = present.wordsTotal !== additional.sumTotal;
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
          {
            tag: 'tr',
            children: [
              { tag: 'th' },
              { tag: 'th', innerText: 'Total' },
              showAbsolutes && { tag: 'th' },
              { tag: 'th', innerText: 'Learning' },
              { tag: 'th', innerText: 'Known' },
              { tag: 'th' },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'th', innerText: 'New' },
              showMains && { tag: 'th', innerText: 'Due' },
              showLocked && { tag: 'th', innerText: 'Locked' },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'th', innerText: 'Progress' },
              showAbsolutes && { tag: 'th', innerText: 'Upcoming' },
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
              { tag: 'td', innerText: present.wordsLearning },
              { tag: 'td', innerText: present.wordsKnown },
              { tag: 'td', innerText: `${present.wordsPercent}%` },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'td', class: 'green', innerText: additional.newVocab },
              showMains && {
                tag: 'td',
                class: dueVocab > 0 ? 'red' : 'green',
                innerText: dueVocab,
              },
              showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedWords },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.wordsProgress,
              },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.wordsUpcoming,
              },
              showAbsolutes && {
                tag: 'td',
                class: ['opac'],
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
              { tag: 'td', innerText: present.wordsIndirectLearning },
              { tag: 'td', innerText: present.wordsIndirectKnown },
              { tag: 'td', innerText: `${present.wordsIndirectPercent}%` },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'td' },
              showMains && { tag: 'td' },
              showLocked && { tag: 'td' },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
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
              { tag: 'td', innerText: present.kanjiLearning },
              { tag: 'td', innerText: present.kanjiKnown },
              { tag: 'td', innerText: `${present.kanjiPercent}%` },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'td', class: 'green', innerText: additional.newKanji },
              showMains && {
                tag: 'td',
                class: additional.dueKanji > 0 ? 'red' : 'green',
                innerText: additional.dueKanji,
              },
              showLocked && { tag: 'td', class: 'opac', innerText: additional.lockedKanji },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.kanjiProgress,
              },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.kanjiUpcoming,
              },
              showAbsolutes && {
                tag: 'td',
                class: ['opac'],
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
              { tag: 'td', innerText: present.kanjiIndirectLearning },
              { tag: 'td', innerText: present.kanjiIndirectKnown },
              { tag: 'td', innerText: `${present.kanjiIndirectPercent}%` },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'td' },
              showMains && { tag: 'td' },
              showLocked && { tag: 'td' },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
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
              { tag: 'td', innerText: additional.sumLearning },
              { tag: 'td', innerText: additional.sumKnown },
              { tag: 'td', innerText: `${additional.sumPercent}%` },

              (showMains || showLocked) && { tag: 'td' },
              showMains && { tag: 'td', class: 'green', innerText: additional.new },
              showMains && {
                tag: 'td',
                class: additional.due > 0 ? 'red' : 'green',
                innerText: additional.due,
              },
              showLocked && {
                tag: 'td',
                class: 'opac',
                innerText: additional.lockedKanji + additional.lockedWords,
              },

              showAbsolutes && { tag: 'td' },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.sumProgress,
              },
              showAbsolutes && {
                tag: 'td',
                innerText: additional.sumUpcoming,
              },
              showAbsolutes && {
                tag: 'td',
                class: ['opac'],
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
              { tag: 'td' },
              { tag: 'td' },
              { tag: 'td' },
              showMains && { tag: 'td' },
              showMains && { tag: 'td' },
              showLocked && { tag: 'td' },
              (showMains || showLocked) && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
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
              showMains && { tag: 'td' },
              showMains && { tag: 'td' },
              showLocked && { tag: 'td' },
              (showMains || showLocked) && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              showAbsolutes && { tag: 'td' },
              { tag: 'td', class: 'new-today-percent', innerText: '0%' },
            ],
          },
        ],
      },
    ],
  };

  document.jpdb.adjacentElement(nodes.stats!, 'beforebegin', content);
};
