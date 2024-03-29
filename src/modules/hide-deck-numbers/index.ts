((): void => {
  const HIDE_DECK_NUMBERS = 'hide-deck-numbers';

  jpdb.settings.moduleManager.register({
    name: HIDE_DECK_NUMBERS,
    category: 'Learn Page',
    displayText: 'Hide deck numbers',
    description: 'Hide deck numbers on learn page and deck list',
  });
  jpdb.runAlwaysWhenActive(['/learn', '/deck-list'], HIDE_DECK_NUMBERS, () => {
    document.jpdb.withElements(
      "[id|='deck']:not([id*='l']):not([id*='n']) .deck-title",
      (e) => (e.innerHTML = e.innerHTML.replace(/\d+\. /, '')),
    );
  });
})();
