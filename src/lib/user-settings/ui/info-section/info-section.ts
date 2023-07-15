import { container } from '../../../elements/container';
import { redButton } from './red-button';
import { resetSettingsParagraph } from './reset-settings.paragraph';
import { versionParagraph } from './version.paragraph';

export class InfoSection {
  private _container = document.jpdb.findElement('.container.bugfix');

  constructor() {
    this.appendResetSettings();

    document.jpdb.appendElement(this._container, versionParagraph());
  }

  private appendResetSettings(): void {
    document.jpdb.appendElement(
      this._container,
      container([
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
