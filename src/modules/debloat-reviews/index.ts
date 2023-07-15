const DEBLOAT_REVIEWS: string = 'debloat-reviews';

jpdb.settings.registerActivatable({
  name: DEBLOAT_REVIEWS,
  category: 'Reviews',
  displayText: 'Remove unneccessary labels from review, vocabulary and search results',
  description:
    'Remove text that takes up valuable screen space on review, vocabulary and search results',
});

jpdb.runAlwaysWhenActive('/review', DEBLOAT_REVIEWS, () => {
  document.jpdb.withElements('.subsection-label', (e) => {
    if (!e.innerText.startsWith('Keyword') || !e.innerText.startsWith('Meanings')) e.remove();
  });
  document.jpdb.destroyElement('.keyword-missing');
});

jpdb.runOnceWhenActive(/\/kanji/, DEBLOAT_REVIEWS, () => {
  document.jpdb.withElements('.subsection-label', (e) => {
    if (['Info', 'Composed of'].includes(e.innerText)) e.remove();
    document.jpdb.destroyElement('.keyword-missing');
  });
});

jpdb.runOnceWhenActive(/\/vocabulary/, DEBLOAT_REVIEWS, () => {
  document.jpdb.withElements('.subsection-label', (e) => {
    if (['Meanings', 'Custom definition'].includes(e.innerText)) e.remove();
  });
});

jpdb.runOnceWhenActive('/search', DEBLOAT_REVIEWS, () => {
  document.jpdb.withElements('.subsection-label', (e) => {
    e.remove();
  });
});
