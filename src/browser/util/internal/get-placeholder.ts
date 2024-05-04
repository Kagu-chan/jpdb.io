export const getPlaceholder = (options: {
  placeholder?: string;
  helpText?: string | HTMLElement;
}): string =>
  options.placeholder !== undefined
    ? options.placeholder
    : typeof options.helpText === 'string'
    ? options.helpText
    : options.helpText?.innerHTML ?? '';
