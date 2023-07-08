import { createElement } from '../../../dom';

export const resetDataParagraph = (): HTMLParagraphElement =>
  createElement('p', {
    innerText:
      // eslint-disable-next-line max-len
      'This will reset all data (everything the extension wrote at any point of time) and reload the page.',
    style: {
      opacity: '.8',
    },
  });
