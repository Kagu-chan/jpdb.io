export const resetDataParagraph = (): HTMLParagraphElement =>
  document.jpdb.createElement('p', {
    innerText:
      // eslint-disable-next-line max-len
      'This will reset all data (everything the extension wrote at any point of time) and reload the page.',
    style: {
      opacity: '.8',
    },
  });
