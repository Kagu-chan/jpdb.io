import { DOMContainer } from '../../../lib/browser/dom-container';
import { UserSettingsContainer } from '../user-settings.container';

export class UserSettingsReset extends DOMContainer {
  constructor(private _root: UserSettingsContainer) {
    super('reset-user-settings');
  }

  public render(): void {
    super.render();

    this.appendNewElement(this.dom, 'h5', { innerText: 'Other' });
    this.appendNewElement(this.dom, 'input', {
      class: ['outline', 'v1'],
      attributes: {
        type: 'submit',
        value: 'Reset Extension settings',
      },
      handler: () => this._root.api.resetSettings(),
    });
    this.appendNewElement(this.dom, 'p', {
      innerText: 'This will reset all Settings to default and reload the page.',
      style: {
        opacity: '.8',
      },
    });
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._root.dom, element);
  }
}
