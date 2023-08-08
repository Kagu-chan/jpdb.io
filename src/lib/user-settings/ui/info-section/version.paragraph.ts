import { BUGS, HOMEPAGE, NAME, RELEASES, VERSION } from '../../../constants';

export const versionParagraph = (): HTMLParagraphElement =>
  document.jpdb.createElement('p', {
    innerHTML: `You're currently using <a href="${HOMEPAGE}">${NAME} ${VERSION}</a>. Check for new Releases <a href="${RELEASES}" target="_blank">here</a> or <a href="${BUGS}" target="_blank">report a bug</a>`,
    style: {
      opacity: '.8',
    },
  });
