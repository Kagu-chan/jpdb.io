import EventEmitter from 'events';
import { appendElement, findElement } from '../../../dom';
import { container } from '../../../elements/container';
import { redButton } from './red-button';
import { resetDataParagraph } from './reset-data.paragraph';
import { resetSettingsParagraph } from './reset-settings.paragraph';
import { versionParagraph } from './version.paragraph';

export class InfoSection extends EventEmitter {
  private _container = findElement('.container.bugfix');

  constructor() {
    super();

    this.appendResetSettings();
    this.appendResetData();

    appendElement(this._container, versionParagraph());
  }

  private appendResetSettings(): void {
    appendElement(
      this._container,
      container([
        redButton('Reset Extension settings', () => this.emit('reset')),
        resetSettingsParagraph(),
      ]),
    );
  }

  private appendResetData(): void {
    appendElement(
      this._container,
      container([
        redButton('Reset Extension data', () => this.emit('reset-all')),
        resetDataParagraph(),
      ]),
    );
  }
}
