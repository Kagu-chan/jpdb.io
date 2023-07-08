import { SettingsUI } from './ui/settings.ui';

export class UserSettings {
  private _ui: SettingsUI;

  constructor() {
    if (location.match('/settings')) {
      this._ui = new SettingsUI();

      this._ui.on('reset', () => console.log('reset was clicked'));
    }
  }
}
