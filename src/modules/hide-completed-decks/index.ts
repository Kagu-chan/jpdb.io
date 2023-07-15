const HIDE_COMPLETED_DECKS = 'hide-completed-decks';
const HIDE_THRESHOLD_DECKS = 'hide-threshold-decks';

const deckExclusion: string = "[id|='deck']:not([id*='l']):not([id*='n'])";
function getTargetCoverage(): string {
  return jpdb.settings.getJpdbSetting('target-coverage');
}

function getRecognition(e: HTMLDivElement): number {
  return Number(e.innerText.split('(')[1]?.replace(/[^\d]/g, '') ?? 0);
}

function getDeckTargetCoverage(e: HTMLElement): number {
  return Number(
    (e?.parentElement?.nextSibling?.firstChild as HTMLElement)?.style?.left?.replace(/[^\d]/g, ''),
  );
}

jpdb.settings.registerConfigurable({
  name: HIDE_COMPLETED_DECKS,
  category: 'Decks',
  displayText: 'Hide completed decks',
  description: 'Hides decks which do not contain new cards',
});

jpdb.runOnce('/settings', () => {
  if (jpdb.settings.hasPatreonPerks()) {
    const tc = getTargetCoverage();

    jpdb.settings.registerConfigurable({
      name: HIDE_THRESHOLD_DECKS,
      category: 'Decks',
      displayText: 'Hide decks at Target coverage',
      description: `Hides decks where the estimated recognition matches the Target coverage set above, currently ${tc}%`,
    });
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
  document.jpdb.withElements(
    // eslint-disable-next-line max-len
    `.deck${deckExclusion} .deck-body > div > div:first-of-type > div:nth-child(2) > div:last-of-type > div:nth-child(3) > div`,
    (e: HTMLDivElement) => {
      if (getRecognition(e) >= getDeckTargetCoverage(e)) {
        document.jpdb.hideElement(e.closest('.deck') as unknown as HTMLElement);
      }
    },
  );
});
