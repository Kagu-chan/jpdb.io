/**
 * @FIXME: Hides everything when there is no sample sentence. This is obviously a bug.
 * Also, learning names is not handled at all!
 */
((): void => {
  const TSC = 'TSC';
  const HIDE_HIGHLIGHT = 'hide-highlight';

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
        key: 'rem-highlight-hover',
        type: 'checkbox',
        text: 'Tap to reveal',
        description:
          // eslint-disable-next-line max-len
          "Reveals the target word on sentence click or tap - this is useful if the sample sentence contains multiple currently learning words or complex grammar you're not familiar with",
      },
    ],
  });

  jpdb.runOnceWhenEitherIsActive('/review', [TSC, HIDE_HIGHLIGHT], () => {
    if (document.jpdb.findElement('.kind')?.innerText !== 'Vocabulary') return;

    if (jpdb.settings.moduleManager.getActiveState(TSC)) {
      document.jpdb.hideElement('.answer-box .plain');
    }

    if (jpdb.settings.moduleManager.getActiveState(HIDE_HIGHLIGHT)) {
      jpdb.css.add(TSC, __load_css('./src/modules/tsc/sentence-card.css'));

      const target = document.jpdb.findElement('.sentence > .highlight');
      target.classList.add('rem');

      if (jpdb.settings.persistence.getModuleOption(TSC, 'rem-highlight-hover', false)) {
        const mouseTarget = document.jpdb.findElement('.sentence');

        mouseTarget.addEventListener('click', () => target.classList.remove('rem'));
        mouseTarget.addEventListener('touch', () => target.classList.remove('rem'));
      }
    }
  });
})();
