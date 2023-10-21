enum NEVER_FORGET {
  HIDE = 'HIDE',
  REMOVE = 'REMOVE',
}

/**
 * automatically fail new cards so the model does not yeet them to "in 80 years"
 */
export class MoveNeverForget {
  private NEVER_FORGET_ACTION: string = 'never-forget-action';
  private NEVER_FORGET_LABELS: Record<NEVER_FORGET, string> = {
    [NEVER_FORGET.HIDE]: 'Hide in dropdown',
    [NEVER_FORGET.REMOVE]: 'Remove action',
  };

  constructor() {
    jpdb.settings.renameModuleSetting('move-never-forget', MoveNeverForget.name);

    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: MoveNeverForget.name,
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
  }

  private addListeners(): void {
    jpdb.runOnceWhenActive('/review', MoveNeverForget.name, () => {
      if (
        jpdb.settings.persistence.getModuleOption<NEVER_FORGET>(
          MoveNeverForget.name,
          this.NEVER_FORGET_ACTION,
        ) === NEVER_FORGET.REMOVE
      ) {
        document.jpdb.withElement('#grade-permaknown', (e) => e.remove());

        return;
      }

      jpdb.css.add(
        MoveNeverForget.name,
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
