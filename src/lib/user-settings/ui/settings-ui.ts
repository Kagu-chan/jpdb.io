import { InfoSection } from './info-section/info-section';

export class SettingsUI {
  public readonly infoSection: InfoSection;

  public readonly stable = document.jpdb.appendElement(
    '.container.bugfix',
    document.util.container([]),
  );
  public readonly experimental = document.jpdb.adjacentElement(
    this.stable,
    'afterend',
    document.util.container([]),
  );

  constructor() {
    this.infoSection = new InfoSection();
  }
}
