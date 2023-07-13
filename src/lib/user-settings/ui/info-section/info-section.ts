import EventEmitter from 'events';
import { container } from '../../../elements/container';
import { redButton } from './red-button';
import { resetSettingsParagraph } from './reset-settings.paragraph';
import { versionParagraph } from './version.paragraph';

export class InfoSection extends EventEmitter {
  private _container = document.jpdb.findElement('.container.bugfix');

  constructor() {
    super();

    this.appendResetSettings();

    document.jpdb.appendElement(this._container, versionParagraph());
  }

  private appendResetSettings(): void {
    document.jpdb.appendElement(
      this._container,
      container([
        redButton('Reset Extension settings', () => this.emit('reset')),
        resetSettingsParagraph(),
      ]),
    );
  }
}
