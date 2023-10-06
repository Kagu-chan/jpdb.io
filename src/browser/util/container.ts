export const container = (
  children: DOMElementTagOptions['children'],
  options?: Omit<DOMElementTagOptions<'div'>, 'children' | 'tag'>,
): HTMLDivElement =>
  document.jpdb.createElement({
    tag: 'div',
    ...(options ?? {}),
    children,
  });
