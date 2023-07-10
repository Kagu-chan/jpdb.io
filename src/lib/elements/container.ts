import { DOMElementTagOptions } from '../_dom/types';

export const container = (children: DOMElementTagOptions['children']): HTMLDivElement =>
  document.jpdb.createElement({
    tag: 'div',
    children,
  });
