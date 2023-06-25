import { prependElement } from '../../../lib/dom';
import { UserSettingsPluginAPI } from '../user-settings-plugin.api';

export const renderSaveControl = (api: UserSettingsPluginAPI): HTMLInputElement =>
  prependElement('#save-all-settings-box', {
    tag: 'input',
    id: 'save-user-settings',
    class: ['outline'],
    attributes: {
      type: 'submit',
      value: 'Save Extension settings',
    },
    style: {
      fontWeight: 'bold',
      marginRight: '9px',
    },
    handler: (ev) => {
      ev.preventDefault();

      api.saveSettings();
    },
  });
