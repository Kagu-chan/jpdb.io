const SETTINGS_NAV: string = 'settings-nav';

function getList(): HTMLDivElement {
  type SettingsLink = { text: string; e: HTMLElement };

  const elements: Array<SettingsLink> = [];
  const div = document.jpdb.createElement('div', {
    class: ['s-nav-wrapper', 'outline', 'v2', 'closed'],
  });
  const ul = document.jpdb.appendElement(div, {
    tag: 'ul',
    class: ['settings-navigation'],
  });

  let lastMainSection: HTMLUListElement;

  document.jpdb.findElements<'h4' | 'h6'>('h4:not(.hidden), h6:not(.hidden)').forEach((e) => {
    elements.push({ text: e.innerText, e });
  });

  elements.forEach(({ text, e }) => {
    const a = document.jpdb.createElement({
      tag: 'a',
      innerText: text,
      handler: (): void => {
        window.scrollTo({ top: e.offsetTop, behavior: 'smooth' });
        div.classList.add('closed');
      },
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
    key: `${SETTINGS_NAV}-list`,
    css: `
.s-nav-wrapper {
  max-height: 200px;
  
  border: 1px solid var(--button-background-color);
  background-color: var(--outline-input-background-color);
  
  box-shadow: none;
  transform: none;
  border-radius: .5rem;
  
  padding: 1rem;

  overflow-y: auto;

  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.s-nav-wrapper::-webkit-scrollbar {
  display: none;
}

.settings-navigation {
  margin-bottom: unset;

  font-size: 1.0rem;
  line-height: 2.0rem;

  list-style: none;
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

  return div;
}

function getBurgerMenu(): HTMLElement {
  const cb = document.jpdb.createElement({
    tag: 'input',
    class: ['s-nav-btn'],
    attributes: { type: 'checkbox' },
  });

  const div = document.jpdb.createElement('div', {
    class: ['s-nav-menu'],
    children: [
      cb,
      {
        tag: 'label',
        class: ['s-nav-icon'],
        attributes: { for: cb.id },
        children: [
          {
            tag: 'span',
            class: ['navicon'],
          },
        ],
        handler: (): void => {
          document.jpdb.findElement('.s-nav-wrapper').classList.toggle('closed');
        },
      },
    ],
  });

  jpdb.css.add({
    key: `${SETTINGS_NAV}-burger`,
    css: `
.s-nav-btn { display: none !important; }

.s-nav-icon {
  cursor: pointer;
  display: inline-block;
  padding: 1.4rem;
  padding-top: 1.3rem;
  padding-bottom: 1.5rem;
  padding-right: 0.3rem;
  user-select: none;
}

.s-nav-icon .navicon {
  background: var(--burger-color);
  display: block;
  height: 2px;
  position: relative;
  transition: background .2s ease-out;
  width: 1rem;
}

.s-nav-icon .navicon:before { top: 5px; }
.s-nav-icon .navicon:after { top: -5px; }

.s-nav-icon .navicon:before, .s-nav-icon .navicon:after {
  background: var(--burger-color);
  content: '';
  display: block;
  height: 100%;
  position: absolute;
  transition: all .2s ease-out;
  width: 100%;
}
    `,
  });

  return div;
}

function addDesktopCss(): void {
  jpdb.css.add({
    key: `${SETTINGS_NAV}-desktop`,
    css: `
@media only screen and (min-width: 1080px) {
  .s-nav-wrapper {
    width: unset;
    max-height: calc(100% - 11rem);
    position: fixed;
    top: 5rem;
    left: 1rem;

    padding: 1.5rem;
  }

  .s-nav-wrapper ul {
    padding-left: unset;
  }

  .s-nav-menu { display: none; }
}

@media only screen and (max-width: 1690px) {
  .s-nav-menu {
    display: block;

    position: fixed;
    top: 4rem;
    left: 0rem;
  }

  .s-nav-wrapper {
    top: 7rem;
    max-height: calc(100% - 13rem);

    transition: all ease-in-out .2s;
  }

  .s-nav-wrapper.closed {
    max-height: 0;
    padding: 0;
    border-width: 0;

    transition: all ease-in-out .2s;
  }
}
    `,
  });
}

function addMobileCss(): void {
  jpdb.css.add({
    key: `${SETTINGS_NAV}-mobile`,
    css: `
@media only screen and (max-width: 1080px) {
  .s-nav-menu {
    top: unset;
    left: unset;

    bottom: 0;
    right: 1rem;
    z-index: 1000;
  }

  .s-nav-wrapper {
    position: fixed;
    width: calc(100% - 2rem);
    top: 5rem;
    max-height: 9999px;
    height: calc(100% - 11rem);

    transition: unset;
  }

  .s-nav-wrapper.closed {
    transition: unset;
  }
}
    `,
  });
}

jpdb.settings.registerConfigurable({
  name: SETTINGS_NAV,
  category: 'Misc',
  displayText: 'Add table of contents to settings',
  description:
    // eslint-disable-next-line max-len
    'Adds an always visible table of contents to the settings page, making it easier to jump to specific settings',
});

jpdb.runOnceWhenActive('/settings', SETTINGS_NAV, () => {
  document.jpdb.appendElement('.container.bugfix', getList());
  document.jpdb.appendElement('.container.bugfix', getBurgerMenu());

  addDesktopCss();
  addMobileCss();
});
