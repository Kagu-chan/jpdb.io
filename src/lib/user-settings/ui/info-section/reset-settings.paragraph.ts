import { createElement } from '../../../dom';

export const resetSettingsParagraph = (): HTMLParagraphElement =>
  createElement('p', {
    innerText: 'This will reset all Settings to default and reload the page.',
    style: {
      opacity: '.8',
    },
  });
