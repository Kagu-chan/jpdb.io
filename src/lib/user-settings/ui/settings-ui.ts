import { container } from '../../elements/container';
import { InfoSection } from './info-section/info-section';

export class SettingsUI {
  public readonly stable = document.jpdb.appendElement('.container.bugfix', container([]));
  public readonly experimental = document.jpdb.adjacentElement(
    this.stable,
    'afterend',
    container([]),
  );

  constructor() {
    new InfoSection();
  }
}
