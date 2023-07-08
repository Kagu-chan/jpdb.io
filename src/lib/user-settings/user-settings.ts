import { SettingsUI } from './ui/settings.ui';

export class UserSettings {
  private _ui: SettingsUI;

  constructor() {
    if (location.match('/settings')) {
      this._ui = new SettingsUI();

      // eslint-disable-next-line no-console
      this._ui.on('reset', () => console.log('reset was clicked'));
      // eslint-disable-next-line no-console
      this._ui.on('reset-all', () => console.log('reset all was clicked'));
    }
  }
}
