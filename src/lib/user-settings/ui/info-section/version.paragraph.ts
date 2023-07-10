import { BUGS, HOMEPAGE, NAME, RELEASES, VERSION } from '../../../constants';
import { createElement } from '../../../dom';

export const versionParagraph = (): HTMLParagraphElement =>
  createElement('p', {
    innerHTML: `You're currently using <a href="${HOMEPAGE}">${NAME} ${VERSION}</a>. Check for new Releases <a href="${RELEASES}" target="_blank">here</a> or <a href="${BUGS}" target="_blank">report a bug</a>`,
    style: {
      opacity: '.8',
    },
  });
