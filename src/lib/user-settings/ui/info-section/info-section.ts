import { migrateOldRunner } from './migrate-old-runner';
import { redButton } from './red-button';
import { versionParagraph } from './version.paragraph';

export class InfoSection {
  private _container = document.jpdb.findElement('.container.bugfix');

  constructor() {
    this.migrateOldRunner();
    this.appendResetSettings();

    document.jpdb.appendElement(this._container, versionParagraph());
  }

  public addRenameMigrator(fromKey: string, toKey: string): void {
    setTimeout(() => {
      if (
        localStorage.getItem(fromKey) !== null ||
        jpdb.settings.moduleManager.getActiveState(fromKey)
      ) {
        if (localStorage.getItem(fromKey) !== null) {
          localStorage.setItem(toKey, localStorage.getItem(fromKey)!);
          localStorage.removeItem(fromKey);
        }

        if (jpdb.settings.moduleManager.getActiveState(fromKey)) {
          jpdb.settings.moduleManager.disableModule(fromKey);
          jpdb.settings.moduleManager.enableModule(toKey);
        }
      }
    }, 10);
  }

  // @TODO: Will be DELETED in January 2024!
  private migrateOldRunner(): void {
    setTimeout(() => {
      migrateOldRunner();
    }, 10);
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
