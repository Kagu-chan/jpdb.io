export const collapsible = (
  children: DOMElementTagOptions['children'],
  accordionOptions: {
    text: string;
    open?: boolean;
  },
  options?: Omit<DOMElementTagOptions<'div'>, 'children' | 'tag'>,
): HTMLDetailsElement => {
  const el = document.jpdb.createElement({
    tag: 'details',
    class: ['accordion'],
    children: [
      {
        tag: 'summary',
        innerText: accordionOptions.text,
      },
      {
        tag: 'div',
        ...(options ?? {}),
        children,
      },
    ],
  });

  if (accordionOptions?.open) {
    el.setAttribute('open', '');
  }

  return el;
};
