export const resetSettingsParagraph = (): HTMLParagraphElement =>
  document.jpdb.createElement('p', {
    innerText: 'This will reset all Settings to default and reload the page.',
    style: {
      opacity: '.8',
    },
  });
