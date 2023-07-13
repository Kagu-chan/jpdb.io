const TSC = 'TSC';

window.jpdb.settings.registerActivatable(
  TSC,
  'Targeted sentence cards',
  'Remove the target word from reviews, thus turning them into targeted sentence cards',
);
window.jpdb.runOnceWhenActive('/review', TSC, () => {
  if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
    document.jpdb.hideElement('.answer-box .plain');
  }
});
