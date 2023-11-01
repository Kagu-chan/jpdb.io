import { migrateOldRunner } from './migrate-old-runner';
import { redButton } from './red-button';
import { resetSettingsParagraph } from './reset-settings.paragraph';
import { versionParagraph } from './version.paragraph';

export class InfoSection {
  private _container = document.jpdb.findElement('.container.bugfix');

  constructor() {
    this.migrateOldRunner();
    this.appendResetSettings();

    document.jpdb.appendElement(this._container, versionParagraph());
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
        resetSettingsParagraph(),
      ]),
    );
  }
}
