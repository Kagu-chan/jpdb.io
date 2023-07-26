((): void => {
  const withNode = (node: HTMLDivElement): void => {
    const { adjacentElement, findElement, findElements, textFromNode } = document.jpdb;

    const getWord = (): string => {
      return (
        textFromNode('.primary-spelling ruby') ??
        findElements(node, '.vocabulary-spelling a ruby').reduce((s, n) => s + textFromNode(n), '')
      );
    };
    const form = findElement(node, 'form[action="/blacklist"]');
    const v = findElement<'input'>(form, 'input[name=v]').value;
    const s = findElement<'input'>(form, 'input[name=s]').value;
    const li = form.parentElement;
    const word = getWord();

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
              attributes: {
                type: 'submit',
                value: 'Unsuspend',
                onclick: `post_refresh_and_notify('Unsuspended ${word}')`,
              },
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
  jpdb.runAlways(/\/search/, () => {
    document.jpdb
      .findElements<'div'>('.result.vocabulary')
      .filter((e) => !!document.jpdb.findElement(e, '.tag.suspended'))
      .map((e) => withNode(e));
  });
})();
