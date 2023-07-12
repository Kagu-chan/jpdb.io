const { adjacentElement, findElement, withElement, withElements } = document.jpdb;

const withNode = (node: HTMLDivElement): void => {
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
window.jpdb.runAlways('/deck', () => {
  withElements('.entry.suspended', withNode);
});
window.jpdb.runAlways(/\/vocabulary/, () => {
  if (!findElement('.tag.suspended')) return;

  withElement('.dropdown-content', withNode);
});
