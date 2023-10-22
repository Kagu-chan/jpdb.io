((): void => {
  const TSC = 'TSC';
  const HIDE_HIGHLIGHT = 'hide-highlight';
  const REM_HIGHLIGHT_HOVER = 'rem-highlight-hover';

  jpdb.settings.moduleManager.register({
    name: TSC,
    category: 'Reviews',
    displayText: 'Sentence cards',
    description:
      'Remove the target word from reviews, thus turning them into targeted sentence cards',
  });

  jpdb.settings.moduleManager.register({
    name: HIDE_HIGHLIGHT,
    category: 'Reviews',
    displayText: 'Hide sample sentence target word highlight',
    description:
      // eslint-disable-next-line max-len
      'Remove the target word highlight in sample sentences, avoiding directly recognizing the usage without reading the sentence',
    options: [
      {
        key: REM_HIGHLIGHT_HOVER,
        type: 'checkbox',
        text: 'Tap to reveal',
        default: false,
        description:
          // eslint-disable-next-line max-len
          "Reveals the target word on sentence click or tap - this is useful if the sample sentence contains multiple currently learning words or complex grammar you're not familiar with",
      },
    ],
  });

  jpdb.runOnceWhenEitherIsActive('/review', [TSC, HIDE_HIGHLIGHT], () => {
    const target = document.jpdb.findElement('.sentence > .highlight');

    if (!target) {
      return;
    }

    if (document.jpdb.findElement('.kind')?.innerText !== 'Vocabulary') {
      return;
    }

    if (jpdb.settings.moduleManager.getActiveState(TSC)) {
      document.jpdb.hideElement('.answer-box .plain');
    }

    if (jpdb.settings.moduleManager.getActiveState(HIDE_HIGHLIGHT)) {
      jpdb.css.add(TSC, __load_css('./src/modules/tsc/sentence-card.css'));

      target.classList.add('rem');

      if (jpdb.settings.persistence.getModuleOption(HIDE_HIGHLIGHT, REM_HIGHLIGHT_HOVER)) {
        const mouseTarget = document.jpdb.findElement('.sentence');

        mouseTarget.addEventListener('click', () => target.classList.remove('rem'));
        mouseTarget.addEventListener('touch', () => target.classList.remove('rem'));
      }
    }
  });
})();
