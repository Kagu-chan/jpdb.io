import { DOMManager } from '../../../lib/browser/dom-manager';
import { UserSettingsContainer } from '../user-settings.container';

export class UserSettingsSave extends DOMManager {
  public dom: HTMLInputElement;
  private _id: string = 'save-user-settings';

  constructor(private _root: UserSettingsContainer) {
    super();
  }

  public render(): void {
    const footer = this.findOne('#save-all-settings-box');
    this.dom = this.prependNewElement(footer, 'input', {
      id: this._id,
      class: ['outline'],
      attributes: {
        type: 'submit',
        value: 'Save Extension settings',
      },
      style: {
        fontWeight: 'bold',
        marginRight: '9px',
      },
      handler: (event) => {
        event.preventDefault();

        this._root.api.saveSettings();
      },
    });
  }
}
