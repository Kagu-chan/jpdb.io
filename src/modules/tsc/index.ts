((): void => {
  const TSC = 'TSC';

  jpdb.settings.moduleManager.register({
    name: TSC,
    category: 'Reviews',
    displayText: 'Sentence cards',
    description:
      'Remove the target word from reviews, thus turning them into targeted sentence cards',
    options: [
      {
        key: 'rem-highlight',
        type: 'checkbox',
        text: 'Also remove the word highlight',
        description:
          // eslint-disable-next-line max-len
          'Also remove the highlight from the target word in the sample sentence, thus turning it into a pure sentence card',
      },
    ],
  });

  jpdb.runOnceWhenActive('/review', TSC, () => {
    if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
      document.jpdb.hideElement('.answer-box .plain');

      if (jpdb.settings.persistence.getModuleOption(TSC, 'rem-highlight', false)) {
        document.jpdb.findElement('.sentence > .highlight').classList.add('rem');

        jpdb.css.add(TSC, __load_css('./src/modules/tsc/sentence-card.css'));
      }
    }
  });
})();
