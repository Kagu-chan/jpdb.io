import { DOMElementTagOptions } from '../../../lib/dom';
import { UserSettingsPluginAPI } from '../user-settings-plugin.api';

export const getResetControl = (api: UserSettingsPluginAPI): DOMElementTagOptions<'div'> => ({
  tag: 'div',
  id: 'reset-user-settings',
  children: [
    {
      tag: 'input',
      class: ['outline', 'v1'],
      attributes: {
        type: 'submit',
        value: 'Reset Extension settings',
      },
      handler: (ev): void => {
        ev.preventDefault();

        api.resetSettings();
      },
    },
    {
      tag: 'p',
      innerText: 'This will reset all Settings to default and reload the page.',
      style: { opacity: '.8' },
    },
  ],
});
