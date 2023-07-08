import { DOMContainer } from '../../../lib/browser/dom-container';
import { BUGS, NAME, RELEASES } from '../../../lib/constants';
import { UserSettingsContainer } from '../user-settings.container';

export class UserSettingsUpdate extends DOMContainer {
  constructor(private _root: UserSettingsContainer) {
    super('update-user-settings');
  }

  public render(): void {
    super.render();

    this.appendNewElement(this.dom, 'p', {
      innerHTML: `You're currently using ${NAME} ${this.VERSION}. Check for new Releases <a href="${RELEASES}" target="_blank">here</a> or <a href="${BUGS}" target="_blank">report a bug</a>`,
      style: {
        opacity: '.8',
      },
    });
  }

  protected attachToDom(element: HTMLDivElement): void {
    this.appendElement(this._root.dom, element);
  }
}
