import { redButton } from './red-button';
import { versionParagraph } from './version.paragraph';

export class InfoSection {
  private _container = document.jpdb.findElement('.container.bugfix');
  private _onMigrates: (() => void)[] = [];

  constructor() {
    this.appendMigrateSettings();
    this.appendResetSettings();

    document.jpdb.appendElement(this._container, versionParagraph());
  }

  public addRenameMigrator(fromKey: string, toKey: string): void {
    setTimeout(() => {
      if (
        localStorage.getItem(fromKey) !== null ||
        jpdb.settings.moduleManager.getActiveState(fromKey)
      ) {
        this._onMigrates.push(() => {
          if (localStorage.getItem(fromKey) !== null) {
            localStorage.setItem(toKey, localStorage.getItem(fromKey)!);
            localStorage.removeItem(fromKey);
          }

          if (jpdb.settings.moduleManager.getActiveState(fromKey)) {
            jpdb.settings.moduleManager.disableModule(fromKey);
            jpdb.settings.moduleManager.enableModule(toKey);
          }
        });
      }

      if (this._onMigrates.length > 0) {
        document.jpdb.withElement('.migrate-settings', (e) => e.classList.remove('hidden'));
      }
    }, 10);
  }

  private appendMigrateSettings(): void {
    document.jpdb.appendElement(
      this._container,
      document.util.container(
        [
          { tag: 'div', style: { paddingBottom: '1.5rem' } },
          { tag: 'h4', innerText: 'Migrate extension settings' },
          { tag: 'div', style: { paddingBottom: '1rem' } },
          redButton('Migrate outdated settings', () => {
            this._onMigrates.forEach((fn) => fn());

            location.reload();
          }),
          {
            tag: 'p',
            innerText:
              // eslint-disable-next-line max-len
              'This will transfer all module settings, which have been renamed or otherwise overhauled, to its current format. Afterwards the page reloads',
            style: {
              opacity: '.8',
            },
          },
        ],
        { class: ['hidden', 'migrate-settings'] },
      ),
    );
  }

  private appendResetSettings(): void {
    document.jpdb.appendElement(
      this._container,
      document.util.container([
        { tag: 'div', style: { paddingBottom: '1.5rem' } },
        { tag: 'h4', innerText: 'Reset extension settings' },
        { tag: 'div', style: { paddingBottom: '1rem' } },
        redButton('Reset Extension settings', () => {
          localStorage.clear();

          location.reload();
        }),
        {
          tag: 'p',
          innerText: 'This will reset all Settings to default and reload the page.',
          style: {
            opacity: '.8',
          },
        },
      ]),
    );
  }
}
