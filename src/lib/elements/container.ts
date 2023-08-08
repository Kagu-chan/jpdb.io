export const container = (children: DOMElementTagOptions['children']): HTMLDivElement =>
  document.jpdb.createElement({
    tag: 'div',
    children,
  });
