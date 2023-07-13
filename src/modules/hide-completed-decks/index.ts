const HIDE_COMPLETED_DECKS = 'hide-completed-decks';
const HIDE_THRESHOLD_DECKS = 'hide-threshold-decks';

const deckExclusion: string = "[id|='deck']:not([id*='l']):not([id*='n'])";
function getTargetCoverage(): string {
  return jpdb.settings.getJpdbSetting('target-coverage');
}

function setTargetCoverage(): void {
  const value = getTargetCoverage();

  jpdb.settings.setModuleOption(HIDE_THRESHOLD_DECKS, 'value', value);
}

function getRecognition(e: HTMLDivElement): number {
  return Number(e.innerText.split('(')[1]?.replace(/[^\d]/g, '') ?? 0);
}

jpdb.settings.registerActivatable(
  HIDE_COMPLETED_DECKS,
  'Hide completed decks',
  'Hides decks which are completed',
);

jpdb.runOnce('/settings', () => {
  if (jpdb.settings.hasPatreonPerks()) {
    const tc = getTargetCoverage();

    jpdb.settings.registerActivatable(
      HIDE_THRESHOLD_DECKS,
      'Hide decks at Target coverage',
      `Hides decks where the estimated recognition matches the Target coverage set above, currently ${tc}% (Does not work on per deck basis)`,
    );

    // Set the target coverage - this happens on every settings load, which includes after changing the jpdb original value
    setTargetCoverage();
  } else {
    jpdb.settings.disableModule(HIDE_THRESHOLD_DECKS);
  }
});

jpdb.runAlwaysWhenActive('/deck-list', HIDE_COMPLETED_DECKS, () => {
  document.jpdb.withElements<'div'>(
    // eslint-disable-next-line max-len
    `.deck${deckExclusion} .deck-body > div > div:first-of-type > div:first-of-type > div:last-of-type > div:nth-child(3) > div`,
    (textContainer: HTMLDivElement) => {
      if (getRecognition(textContainer) === 100) {
        document.jpdb.hideElement(textContainer.closest('.deck') as unknown as HTMLElement);
      }
    },
  );
});

jpdb.runAlwaysWhenActive('/deck-list', HIDE_THRESHOLD_DECKS, () => {
  const t = jpdb.settings.getModuleOption<number>(HIDE_THRESHOLD_DECKS, 'value', 100);

  document.jpdb.withElements(
    // eslint-disable-next-line max-len
    `.deck${deckExclusion} .deck-body > div > div:first-of-type > div:nth-child(2) > div:last-of-type > div:nth-child(3) > div`,
    (e: HTMLDivElement) => {
      if (getRecognition(e) >= t) {
        document.jpdb.hideElement(e.closest('.deck') as unknown as HTMLElement);
      }
    },
  );
});
