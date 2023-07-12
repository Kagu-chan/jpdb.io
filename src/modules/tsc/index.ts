const TSC = 'TSC';

window.jpdb.settings.registerActivatable(TSC);
window.jpdb.runOnceWhenActive('/review', TSC, () => {
  if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
    document.jpdb.hideElement('.answer-box .plain');
  }
});
