const HIDE_DECK_NUMBERS = 'hide-deck-numbers';

window.jpdb.settings.registerActivatable(
  HIDE_DECK_NUMBERS,
  'Hide deck numbers',
  'Hide deck numbers on learn page and deck list',
);
window.jpdb.runAlwaysWhenActive(['/learn', '/deck-list'], HIDE_DECK_NUMBERS, () => {
  document.jpdb.withElements(
    "[id|='deck']:not([id*='l']):not([id*='n']) .deck-title",
    (e) => (e.innerHTML = e.innerHTML.replace(/\d+\. /, '')),
  );
});
