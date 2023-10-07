export interface LearningStatsDataNodes {
  container: HTMLDivElement;
  stats?: HTMLTableElement;
  locked?: HTMLTableElement;
  statsBody?: HTMLTableSectionElement;
  lockedBody?: HTMLTableSectionElement;
  nonRedundant?: HTMLParagraphElement;
  fulfilled?: HTMLParagraphElement;
  upcoming?: HTMLParagraphElement;
}

export interface LearningStatsPresentData {
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

export interface LearningStatsAdditionalStats {
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

  wordsLK: number;
  wordsNDL: number;
  wordsABS: number;
  wordsABSPercent: number;

  kanjiLK: number;
  kanjiNDL: number;
  kanjiABS: number;
  kanjiABSPercent: number;

  wordsIndirectLK: number;
  wordsIndirectABS: number;

  kanjiIndirectLK: number;
  kanjiIndirectABS: number;

  sumLK: number;
  sumNDL: number;
  sumABS: number;
  sumABSPercent: number;
}
