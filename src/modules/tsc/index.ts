const TSC = 'TSC';

jpdb.settings.registerActivatable({
  name: TSC,
  displayText: 'Targeted sentence cards',
  description:
    'Remove the target word from reviews, thus turning them into targeted sentence cards',
});

jpdb.runOnceWhenActive('/review', TSC, () => {
  if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
    document.jpdb.hideElement('.answer-box .plain');
  }
});