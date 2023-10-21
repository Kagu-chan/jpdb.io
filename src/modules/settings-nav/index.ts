class SettingsNav {
  constructor() {
    jpdb.settings.renameModuleSetting('settings-nav', SettingsNav.name);

    this.register();
    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: SettingsNav.name,
      category: 'Navigation',
      displayText: 'Add table of contents to settings',
      description:
        // eslint-disable-next-line max-len
        'Adds an always visible table of contents to the settings page, making it easier to jump to specific settings',
    });
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable('/settings', SettingsNav.name, () => this.enable());
    jpdb.runOnceOnDisable('/settings', SettingsNav.name, () => this.disable());
  }

  private enable(): void {
    document.jpdb.appendElement('.container.bugfix', this.getList());
    document.jpdb.appendElement('.container.bugfix', this.getBurgerMenu());

    jpdb.css.add({
      key: SettingsNav.name,
      css: __load_css('./src/modules/settings-nav/css-declarations'),
    });
  }

  private disable(): void {
    document.jpdb.destroyElement('.s-nav-wrapper');
    document.jpdb.destroyElement('.s-nav-menu');
  }

  private getList(): HTMLDivElement {
    interface SettingsLink {
      text: string;
      e: HTMLElement;
    }

    const elements: SettingsLink[] = [];
    const div = document.jpdb.createElement('div', {
      class: ['s-nav-wrapper', 'outline', 'v2', 'closed'],
    });
    const ul = document.jpdb.appendElement(div, {
      tag: 'ul',
      class: 'settings-navigation',
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
          class: 'settings-subnavigation',
        });

        document.jpdb.appendElement<typeof ul, 'li'>(ul, {
          tag: 'li',
          children: [a, lastMainSection],
        });
      } else {
        document.jpdb.appendElement(lastMainSection, { tag: 'li', children: [a] });
      }
    });

    return div;
  }

  private getBurgerMenu(): HTMLElement {
    const cb = document.jpdb.createElement({
      tag: 'input',
      class: 's-nav-btn',
      attributes: { type: 'checkbox' },
    });

    const div = document.jpdb.createElement('div', {
      class: 's-nav-menu',
      children: [
        cb,
        {
          tag: 'label',
          class: 's-nav-icon',
          attributes: { for: cb.id },
          children: [
            {
              tag: 'span',
              class: 'navicon',
            },
          ],
          handler: (): void => {
            document.jpdb.findElement('.s-nav-wrapper').classList.toggle('closed');
          },
        },
      ],
    });

    return div;
  }
}

new SettingsNav();
