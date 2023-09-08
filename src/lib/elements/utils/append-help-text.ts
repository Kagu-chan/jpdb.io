import { getHelpTextConfig } from './get-help-text-config';

export const appendHelpText = (container: HTMLElement, helpText?: string | HTMLElement): void => {
  document.jpdb.appendElement(container, getHelpTextConfig(helpText));
};
