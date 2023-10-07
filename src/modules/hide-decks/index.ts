((): void => {
  const HIDE_DECKS: string = 'hide-decks';
  const HIDE_SPECIAL_DECKS: string = 'hide-special-decks';

  jpdb.settings.moduleManager.register({
    name: HIDE_DECKS,
    category: 'Decks',
    displayText: 'Hide decks',
    description: 'Hide your decks from learn page',
  });
  jpdb.settings.moduleManager.register({
    name: HIDE_SPECIAL_DECKS,
    category: 'Decks',
    displayText: 'Hide special decks',
    description: 'Hide special decks from learn page',
  });

  jpdb.runOnceWhenActive('/learn', HIDE_DECKS, () => {
    const decks =
      document.jpdb.countElements('#deck_list + .deck-list .deck') +
      Number(document.jpdb.findElement('a[href="/deck-list"')?.innerText.replace(/[^\d]/g, ''));

    const btn = document.jpdb.adjacentElement(
      'form',
      'afterend',
      document.util.button(`Show ${decks} decks`, {
        handler: () => (location.href = '/deck-list'),
        type: 'default',
      }),
    );

    btn.classList.add('show-deck-list');
    jpdb.onMobile(() => btn.classList.add('mobile'));

    const decksH = document.jpdb.findElement('#deck_list');
    const deckL = decksH.nextSibling!;
    const mDecks = deckL.nextSibling!;
    const manage = mDecks.nextSibling!;

    [decksH, deckL, mDecks, manage].forEach((e) => e.remove());

    jpdb.css.add(HIDE_DECKS, __load_css('./src/modules/hide-decks/hide-decks.css'));
  });

  jpdb.runOnceWhenActive('/learn', HIDE_SPECIAL_DECKS, () => {
    const sDecks = document.jpdb
      .findElements('h4')
      .find(({ innerText }) => innerText === 'Special decks');

    sDecks?.nextSibling!.remove();
    sDecks?.remove();
  });
})();
