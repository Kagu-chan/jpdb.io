import { DOMContainer } from '../../../lib/browser/dom-container';
import { UserSettingsContainer } from '../user-settings.container';

export class UserSettingsOther extends DOMContainer {
  constructor(private _root: UserSettingsContainer) {
    super('other-user-settings');
  }

  public render(): void {
    super.render();

    this.appendNewElement(this.dom, 'h5', { innerText: 'Other' });
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._root.dom, element);
  }
}
