enum NEVER_FORGET {
  HIDE = 'HIDE',
  REMOVE = 'REMOVE',
}

enum FAIL_AT {
  ALL = 'ALL',
  VOCAB = 'VOCAB',
  KANJI = 'KANJI',
}

/**
 * automatically fail new cards so the model does not yeet them to "in 80 years"
 */
class AutoFailNewCards {
  private AUTO_FAIL_ENABLE: string = 'auto-fail-new';
  private AUTO_FAIL_MODE: string = 'auto-fail-mode';
  private AUTO_FAIL_LABELS: Record<FAIL_AT, string> = {
    [FAIL_AT.ALL]: 'Always',
    [FAIL_AT.VOCAB]: 'Only Vocab cards',
    [FAIL_AT.KANJI]: 'Only Kanji cards',
  };

  private NEVER_FORGET_ENABLE: string = 'move-never-forget';
  private NEVER_FORGET_ACTION: string = 'never-forget-action';
  private NEVER_FORGET_LABELS: Record<NEVER_FORGET, string> = {
    [NEVER_FORGET.HIDE]: 'Hide in dropdown',
    [NEVER_FORGET.REMOVE]: 'Remove action',
  };

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.runOnce('/settings', () => {
      if (
        jpdb.settings.hasPatreonPerks() &&
        jpdb.settings.getJpdbRadioSetting('auto-reveal-new-cards')
      ) {
        jpdb.settings.moduleManager.register({
          name: this.AUTO_FAIL_ENABLE,
          category: 'Reviews',
          displayText: 'Automatically fail new cards',
          description: 'Automatically fail new cards once.',
          options: [
            {
              key: this.AUTO_FAIL_MODE,
              type: 'radio',
              options: FAIL_AT,
              labels: this.AUTO_FAIL_LABELS,
              default: FAIL_AT.ALL,
            },
          ],
        });
      } else {
        jpdb.settings.moduleManager.disableModule(this.AUTO_FAIL_ENABLE);
      }

      jpdb.settings.moduleManager.register({
        name: this.NEVER_FORGET_ENABLE,
        category: 'Reviews',
        displayText: 'Modify `I know this, will never forget`',
        description: 'Move or remove the `I know this, will never forget` button on new cards.',
        options: [
          {
            key: this.NEVER_FORGET_ACTION,
            type: 'radio',
            options: NEVER_FORGET,
            labels: this.NEVER_FORGET_LABELS,
            default: NEVER_FORGET.HIDE,
          },
        ],
      });
    });
  }

  private addListeners(): void {
    jpdb.runOnceWhenActive('/review', this.AUTO_FAIL_ENABLE, () => {
      const mode = jpdb.settings.persistence.getModuleOption<FAIL_AT>(
        this.AUTO_FAIL_ENABLE,
        this.AUTO_FAIL_MODE,
      );
      const showAnswer = document.jpdb.findElement('#show-answer');
      const fail = document.jpdb.findElement('input[value="✘ Fail"]');
      const nothing = document.jpdb.findElement('input[value="✘ Nothing"]');
      const isVocab = !!document.jpdb.findElement('.result.vocabulary');

      if (showAnswer || fail || nothing) {
        return;
      }

      if (
        mode === FAIL_AT.ALL ||
        (isVocab && mode === FAIL_AT.VOCAB) ||
        (!isVocab && mode === FAIL_AT.KANJI)
      ) {
        document.jpdb.withElement('#grade-p', (e) => e.closest('.row.row-1')?.remove());
        document.jpdb.withElement<'input'>('#grade-f', (e: HTMLInputElement) => {
          e.classList.remove('v1');

          e.value = 'Next';
        });
      }
    });

    jpdb.runOnceWhenActive('/review', this.NEVER_FORGET_ENABLE, () => {
      if (
        jpdb.settings.persistence.getModuleOption<NEVER_FORGET>(
          this.NEVER_FORGET_ENABLE,
          this.NEVER_FORGET_ACTION,
        ) === NEVER_FORGET.REMOVE
      ) {
        document.jpdb.withElement('#grade-permaknown', (e) => e.remove());

        return;
      }

      jpdb.css.add(
        this.NEVER_FORGET_ENABLE,
        __load_css('./src/modules/auto-fail-new-cards/hide-permaknown.css'),
      );

      document.jpdb.withElement('#grade-permaknown', (e) => {
        const parentDiv = e.closest('.row.row-1');
        const target = document.jpdb.findElement('.hidden-body');

        if (parentDiv && target) {
          document.jpdb.adjacentElement(target, 'afterbegin', parentDiv as HTMLElement);
        }
      });
    });
  }
}

new AutoFailNewCards();
