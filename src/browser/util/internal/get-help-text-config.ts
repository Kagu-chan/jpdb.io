export const getHelpTextConfig = (helpText?: string | HTMLElement): DOMElementTagOptions<'p'> => ({
  tag: 'p',
  innerHTML: typeof helpText === 'string' ? helpText : undefined,
  children: helpText && typeof helpText !== 'string' ? [helpText] : [],
  style: {
    opacity: '.8',
  },
});
