enum FAIL_AT_WON {
  ALL = 'ALL',
  VOCAB = 'VOCAB',
  KANJI = 'KANJI',
}

enum FAIL_AT_WN {
  ALL = 'ALL',
  VOCAB = 'VOCAB',
  KANJI = 'KANJI',
  NAME = 'NAME',
  VOCAB_KANJI = 'VOCAB_KANJI',
  VOCAB_NAME = 'VOCAB_NAME',
  KANJI_NAME = 'KANJI_NAME',
}

/**
 * automatically fail new cards so the model does not yeet them to "in 80 years"
 */
export class AutoFailNewCards {
  private AUTO_FAIL_MODE: string = 'auto-fail-mode';
  private AUTO_FAIL_LABELS_WON: Record<FAIL_AT_WON, string> = {
    [FAIL_AT_WN.ALL]: 'Always',
    [FAIL_AT_WN.VOCAB]: 'On Vocab cards',
    [FAIL_AT_WN.KANJI]: 'On Kanji cards',
  };
  private AUTO_FAIL_LABELS_WN: Record<FAIL_AT_WN, string> = {
    [FAIL_AT_WN.ALL]: 'Always',
    [FAIL_AT_WN.VOCAB]: 'On Vocab cards',
    [FAIL_AT_WN.KANJI]: 'On Kanji cards',
    [FAIL_AT_WN.NAME]: 'On Name cards',
    [FAIL_AT_WN.VOCAB_KANJI]: 'On Vocab and Kanji cards',
    [FAIL_AT_WN.VOCAB_NAME]: 'On Vocab and Name cards',
    [FAIL_AT_WN.KANJI_NAME]: 'On Kanji and Name cards',
  };

  constructor() {
    jpdb.settings.renameModuleSetting('auto-fail-new', AutoFailNewCards.name);

    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.runOnce('/settings', () => {
      if (
        jpdb.settings.hasPatreonPerks() &&
        jpdb.settings.getJpdbRadioSetting('auto-reveal-new-cards')
      ) {
        const namesEnabled = !jpdb.settings.getJpdbRadioSetting('do-not-learn-non-katakana-names');

        if (
          [
            FAIL_AT_WN.NAME,
            FAIL_AT_WN.VOCAB_KANJI,
            FAIL_AT_WN.VOCAB_NAME,
            FAIL_AT_WN.KANJI_NAME,
          ].includes(
            jpdb.settings.persistence.getModuleOption(AutoFailNewCards.name, this.AUTO_FAIL_MODE),
          ) &&
          !namesEnabled
        ) {
          jpdb.settings.moduleManager.disableModule(AutoFailNewCards.name);
          jpdb.settings.persistence.setModuleOption(
            AutoFailNewCards.name,
            this.AUTO_FAIL_MODE,
            FAIL_AT_WON.ALL,
          );
        }

        jpdb.settings.moduleManager.register({
          name: AutoFailNewCards.name,
          category: 'Reviews',
          displayText: 'Automatically fail new cards',
          description: 'Automatically fail new cards once.',
          options: [
            {
              key: this.AUTO_FAIL_MODE,
              type: 'radio',
              options: namesEnabled ? FAIL_AT_WN : FAIL_AT_WON,
              labels: namesEnabled ? this.AUTO_FAIL_LABELS_WN : this.AUTO_FAIL_LABELS_WON,
              default: FAIL_AT_WN.ALL,
            },
          ],
        });
      } else {
        jpdb.settings.moduleManager.disableModule(AutoFailNewCards.name);
      }
    });
  }

  private addListeners(): void {
    jpdb.runOnceWhenActive('/review', AutoFailNewCards.name, () => {
      const mode = jpdb.settings.persistence.getModuleOption<FAIL_AT_WN>(
        AutoFailNewCards.name,
        this.AUTO_FAIL_MODE,
      );
      const showAnswer = document.jpdb.findElement('#show-answer');
      const fail = document.jpdb.findElement('input[value="✘ Fail"]');
      const nothing = document.jpdb.findElement('input[value="✘ Nothing"]');
      const isVocab = !!document.jpdb.findElement('.result.vocabulary');
      const isName =
        isVocab &&
        document.jpdb
          .findElement('.result.vocabulary .part-of-speech > div')
          ?.innerText.includes('Name');

      if (showAnswer || fail || nothing) {
        return;
      }

      let modifyButtons: boolean = false;

      switch (mode) {
        case FAIL_AT_WN.ALL:
          modifyButtons = true;

          break;
        case FAIL_AT_WN.VOCAB:
          modifyButtons = isVocab && !isName;

          break;
        case FAIL_AT_WN.KANJI:
          modifyButtons = !isVocab;

          break;
        case FAIL_AT_WN.NAME:
          modifyButtons = isName;

          break;
        case FAIL_AT_WN.VOCAB_KANJI:
          modifyButtons = !isName;

          break;
        case FAIL_AT_WN.VOCAB_NAME:
          modifyButtons = isVocab;

          break;
        case FAIL_AT_WN.KANJI_NAME:
          modifyButtons = !isVocab || isName;

          break;
      }

      if (modifyButtons) {
        document.jpdb.withElement('#grade-p', (e) => e.closest('.row.row-1')?.remove());
        document.jpdb.withElement<'input'>('#grade-f', (e: HTMLInputElement) => {
          e.classList.remove('v1');

          e.value = 'Next';
        });
      }
    });
  }
}
