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
        hideOrDisable: 'disable',
        children: [
          {
            key: 'rem-highlight-hover',
            type: 'checkbox',
            text: 'Tap to reveal',
            description:
              // eslint-disable-next-line max-len
              "Reveals the target word on sentence click or tap - this is useful if the sample sentence contains multiple currently learning words or complex grammar you're not familiar with",
          },
        ],
      },
    ],
  });

  jpdb.runOnceWhenActive('/review', TSC, () => {
    if (document.jpdb.findElement('.kind')?.innerText === 'Vocabulary') {
      document.jpdb.hideElement('.answer-box .plain');

      if (jpdb.settings.persistence.getModuleOption(TSC, 'rem-highlight', false)) {
        jpdb.css.add(TSC, __load_css('./src/modules/tsc/sentence-card.css'));

        const target = document.jpdb.findElement('.sentence > .highlight');
        target.classList.add('rem');

        if (jpdb.settings.persistence.getModuleOption(TSC, 'rem-highlight-hover', false)) {
          const mouseTarget = document.jpdb.findElement('.sentence');

          mouseTarget.addEventListener('click', () => target.classList.remove('rem'));
          mouseTarget.addEventListener('touch', () => target.classList.remove('rem'));
        }
      }
    }
  });
})();
