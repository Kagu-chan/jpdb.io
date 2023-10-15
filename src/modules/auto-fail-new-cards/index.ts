/**
 * automatically fail new cards so the model does not yeet them to "in 80 years"
 */
class AutoFailNewCards {
  private AUTO_FAIL_NEW_CARDS: string = 'auto-fail-new';

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.AUTO_FAIL_NEW_CARDS,
      category: 'Reviews',
      displayText: 'Automatically fail new cards',
      description: `
<div>Automatically fail new cards once.</div>
<p>This should avoid new vocab to be set to known and review in a very long period initially</p>
`,
      options: [
        {
          key: 'forbid-permaknown',
          type: 'checkbox',
          text: 'Forbid marking cards as known permanently',
          description:
            // eslint-disable-next-line max-len
            'Removes the possibility to mark cards as known permanents (I know this, will never forget)',
          default: false,
        },
      ],
    });
  }

  private addListeners(): void {
    jpdb.runOnceWhenActive('/review', this.AUTO_FAIL_NEW_CARDS, () => {
      const showAnswer = document.jpdb.findElement('#show-answer');
      const fail = document.jpdb.findElement('input[value="✘ Fail"]');
      const nothing = document.jpdb.findElement('input[value="✘ Nothing"]');

      if (showAnswer || fail || nothing) {
        return;
      }

      if (
        jpdb.settings.persistence.getModuleOption<boolean>(
          this.AUTO_FAIL_NEW_CARDS,
          'forbid-permaknown',
        )
      ) {
        document.jpdb.withElement('#grade-permaknown', (e) => e.remove());
      }

      document.jpdb.withElement('#grade-p', (e) => e.remove());
      document.jpdb.withElement<'input'>('#grade-f', (e: HTMLInputElement) => {
        e.classList.remove('v1');

        e.value = 'Next';
      });
    });
  }
}

new AutoFailNewCards();
