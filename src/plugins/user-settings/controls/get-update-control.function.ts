import { BUGS, NAME, RELEASES, VERSION } from '../../../lib/constants';
import { DOMElementTagOptions } from '../../../lib/dom';

export const getUpdateControl = (): DOMElementTagOptions<'div'> => ({
  tag: 'div',
  id: 'update-user-settings',
  children: [
    {
      tag: 'p',
      style: { opacity: '.8' },
      innerHTML: `You're currently using ${NAME} ${VERSION}. Check for new Releases <a href="${RELEASES}" target="_blank">here</a> or <a href="${BUGS}" target="_blank">report a bug</a>`,
    },
  ],
});
