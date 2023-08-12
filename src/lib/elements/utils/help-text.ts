export const appendHelpText = (container: HTMLElement, helpText?: string | HTMLElement): void => {
  document.jpdb.appendElement(container, {
    tag: 'p',
    innerHTML: typeof helpText === 'string' ? helpText : undefined,
    children: typeof helpText !== 'string' ? [helpText] : [],
    style: {
      opacity: '.8',
    },
  });
};
