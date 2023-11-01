((): void => {
  const UNSUSPEND: string = 'unsuspend';

  const withNode = (node: HTMLDivElement): void => {
    const { adjacentElement, findElement, findElements, textFromNode } = document.jpdb;

    if (findElement(node, 'a[href*="review-history"]')) {
      return;
    }

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
    const isUnsuspend = findElement(node, '.suspended');
    const isUnlock = findElement(node, '.locked');

    adjacentElement(li!, 'afterend', {
      tag: 'li',
      children: [
        {
          tag: 'form',
          class: 'link-like',
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
                value: isUnsuspend
                  ? 'Unsuspend'
                  : isUnlock
                  ? 'Unlock and learn'
                  : 'Add failed review',
                type: 'submit',
                onclick: `post_refresh_and_notify('Added review to ${word}')`,
              },
            },
          ],
        },
      ],
    });
  };

  jpdb.settings.moduleManager.register({
    name: UNSUSPEND,
    category: 'Reviews',
    displayText: 'Allow manipulating card states',
    description: 'Allows manipulating the card state when opening the context menu of a card.',
  });

  jpdb.runAlwaysWhenActive('/deck', UNSUSPEND, () => {
    document.jpdb.withElements('.entry.suspended, .entry.locked, .entry.new', withNode);
  });
  jpdb.runAlwaysWhenActive(/\/vocabulary/, UNSUSPEND, () => {
    if (!document.jpdb.findElement('.tag.suspended, .tag.locked, .tag.new')) {
      return;
    }

    document.jpdb.withElement('.dropdown-content', withNode);
  });
  jpdb.runAlwaysWhenActive(/\/search/, UNSUSPEND, () => {
    document.jpdb
      .findElements<'div'>('.result.vocabulary')
      .filter((e) => !!document.jpdb.findElement(e, '.tag.suspended, .tag.locked, .tag.new'))
      .map((e) => withNode(e));
  });
})();
