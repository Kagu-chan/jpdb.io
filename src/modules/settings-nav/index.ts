const SETTINGS_NAV: string = 'settings-nav';

jpdb.onDesktop(() => {
  jpdb.settings.registerActivatable({
    name: SETTINGS_NAV,
    displayText: 'Add table of contents to settings',
    description:
      // eslint-disable-next-line max-len
      'Adds an always visible table of contents to the settings page, making it easier to just to specific settings',
  });

  jpdb.runOnceWhenActive('/settings', SETTINGS_NAV, () => {
    const elements: Array<{ text: string; e: HTMLElement }> = [];
    const ul = document.jpdb.appendElement('.container.bugfix', {
      tag: 'ul',
      class: ['settings-navigation', 'outline', 'v2'],
    });
    let lastMainSection: HTMLUListElement;

    document.jpdb.findElements<'h4' | 'h6'>('h4, h6').forEach((e) => {
      elements.push({ text: e.innerText, e });
    });

    elements.forEach(({ text, e }) => {
      const a = document.jpdb.createElement({
        tag: 'a',
        innerText: text,
        handler: (): void => window.scrollTo({ top: e.offsetTop, behavior: 'smooth' }),
      });

      if (e.tagName.toLowerCase() === 'h4') {
        lastMainSection = document.jpdb.createElement({
          tag: 'ul',
          class: ['settings-subnavigation'],
        });

        document.jpdb.appendElement<typeof ul, 'li'>(ul, {
          tag: 'li',
          children: [a, lastMainSection],
        });
      } else {
        document.jpdb.appendElement(lastMainSection, { tag: 'li', children: [a] });
      }
    });

    jpdb.css.add({
      key: SETTINGS_NAV,
      css: `
.settings-navigation {
  position: fixed;
  top: 5rem;
  left: 2rem;

  padding: 1rem;
  margin-bottom: unset;

  border: 1px solid var(--button-background-color);
  font-size: 1.0rem;
  line-height: 2.0rem;

  list-style: none;

  background-color: var(--outline-input-background-color);
  box-shadow: none;
  transform: none;
  border-radius: .5rem;
}

.settings-navigation li {
  margin-bottom: unset;
}

.settings-navigation a {
  cursor: pointer;
}

.settings-subnavigation {
  list-style: none;
}

.settings-subnavigation:empty { display: none; }
    `,
    });
  });
});

// mama holt oma ab, kommt dienstag
