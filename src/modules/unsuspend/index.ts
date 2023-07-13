const withNode = (node: HTMLDivElement): void => {
  const { adjacentElement, findElement } = document.jpdb;

  const form = findElement(node, 'form[action="/blacklist"]');
  const v = findElement<'input'>(form, 'input[name=v]').value;
  const s = findElement<'input'>(form, 'input[name=s]').value;
  const li = form.parentElement;

  adjacentElement(li, 'afterend', {
    tag: 'li',
    children: [
      {
        tag: 'form',
        class: ['link-like'],
        attributes: {
          method: 'post',
          action: '/review',
        },
        children: [
          { tag: 'input', attributes: { type: 'hidden', name: 'c', value: `vf,${v},${s}` } },
          { tag: 'input', attributes: { type: 'hidden', name: 'r', value: '0' } },
          { tag: 'input', attributes: { type: 'hidden', name: 'g', value: 'f' } },
          {
            tag: 'input',
            attributes: { type: 'submit', value: 'Unsuspend', onclick: 'post_and_refresh()' },
          },
        ],
      },
    ],
  });
};
jpdb.runAlways('/deck', () => {
  document.jpdb.withElements('.entry.suspended', withNode);
});
jpdb.runAlways(/\/vocabulary/, () => {
  if (!document.jpdb.findElement('.tag.suspended')) return;

  document.jpdb.withElement('.dropdown-content', withNode);
});
