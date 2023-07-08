import { DOMElementTagOptions, createElement } from '../dom';

export const container = (children: DOMElementTagOptions['children']): HTMLDivElement =>
  createElement({
    tag: 'div',
    children,
  });
