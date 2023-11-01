class StickyNavbar {
  private STICKY_NAVBAR: string = 'sticky-navbar';
  private STICKY_FOOTER: string = 'sticky-footer';

  constructor() {
    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.STICKY_NAVBAR,
      category: 'Navigation',
      displayText: 'Fix header navigation',
      description:
        'Sticks the header navigation to the top of the page, thus making it always visible',
      author: 'JawGBoi',
    });
    jpdb.settings.moduleManager.register({
      name: this.STICKY_FOOTER,
      category: 'Navigation',
      displayText: 'Fix footer navigation',
      description:
        'Sticks the footer navigation to the bottom of the page, thus making it always visible',
    });
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable(/^(?!\/review)/, this.STICKY_NAVBAR, () => this.addStickyNavbar());
    jpdb.runOnceOnDisable(/^(?!\/review)/, this.STICKY_NAVBAR, () => this.removeStickyNavbar());

    jpdb.runOnceOnEnable(/^(?!\/(review|settings))/, this.STICKY_FOOTER, () => {
      this.addStickyFooter();
    });
    jpdb.runOnceOnDisable(/^(?!\/(review|settings))/, this.STICKY_FOOTER, () => {
      this.makeFooterUncollapsible();
      this.removeStickyFooter();
    });

    jpdb.runOnceOnEnable(/\/(review|settings)/, this.STICKY_FOOTER, () =>
      jpdb.css.add({
        key: this.STICKY_FOOTER,
        css: __load_css('./src/modules/sticky-navbar/footer-fix.css'),
      }),
    );
    jpdb.runOnceOnDisable(/\/(review|settings)/, this.STICKY_FOOTER, () =>
      jpdb.css.remove(this.STICKY_FOOTER),
    );
  }

  private addStickyNavbar(): void {
    add_and_run_event_listener(document, 'virtual-refresh', () => {
      document.jpdb.adjacentElement('body', 'afterbegin', {
        tag: 'div',
        class: 'navbar-spacer',
        style: {},
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      add_and_run_event_listener(document, 'resize', this.resizeNavbarSpacer);
    });

    jpdb.css.add({
      key: this.STICKY_NAVBAR,
      css: __load_css('./src/modules/sticky-navbar/navbar.css'),
    });
  }

  private addStickyFooter(): void {
    add_and_run_event_listener(document, 'virtual-refresh', () => {
      this.makeFooterCollapsible();

      document.jpdb.adjacentElement('body', 'beforeend', {
        tag: 'div',
        class: 'footer-spacer',
        style: {},
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      add_and_run_event_listener(document, 'resize', this.resizeFooterSpacer);
    });

    jpdb.css.add({
      key: this.STICKY_FOOTER,
      css: __load_css('./src/modules/sticky-navbar/footer.css'),
    });

    jpdb.runAlways(/deck/, () => {
      const lockLinks = document.jpdb.findElement('.pagination') ? 2 : 3;

      document.jpdb
        .findElements('.entry .dropdown')
        .reverse()
        .slice(0, lockLinks)
        .forEach((e) => e.classList.add('add-pad'));
    });
  }

  private removeStickyNavbar(): void {
    document.jpdb.destroyElement('.navbar-spacer');
    jpdb.css.remove(this.STICKY_NAVBAR);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.removeEventListener('resize', this.resizeNavbarSpacer);
  }

  private removeStickyFooter(): void {
    document.jpdb.destroyElement('.footer-spacer');
    jpdb.css.remove(this.STICKY_FOOTER);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    document.removeEventListener('resize', this.resizeFooterSpacer);
  }

  private resizeNavbarSpacer(): void {
    document.jpdb.withElement('.navbar-spacer', (el) => {
      el.style.paddingTop = `calc(${
        document.jpdb.findElement('.nav')?.offsetHeight ?? 0
      }px + 1rem)`;
    });
  }

  private resizeFooterSpacer(): void {
    document.jpdb.withElement('.footer-spacer', (el) => {
      el.style.paddingBottom = `calc(${
        document.jpdb.findElement('.footer')?.offsetHeight ?? 0
      }px + 1rem)`;
    });
  }

  private makeFooterCollapsible(): void {
    const newContainer = document.jpdb.adjacentElement('.footer', 'afterbegin', {
      tag: 'div',
      id: 'menu-footer',
      class: 'menu',
    });
    const checkbox = document.jpdb.adjacentElement('.footer', 'afterbegin', {
      tag: 'input',
      id: 'menu-btn-footer',
      class: 'menu-btn',
      attributes: {
        type: 'checkbox',
      },
    });

    document.jpdb.adjacentElement(checkbox, 'afterend', {
      tag: 'label',
      class: 'menu-icon',
      id: 'menu-btn-control',
      attributes: {
        for: 'menu-btn-footer',
      },
      children: [
        {
          tag: 'span',
          class: 'navicon',
        },
      ],
    });

    document.jpdb.withElements('footer > a', (e) => newContainer.append(e));
  }

  private makeFooterUncollapsible(): void {
    const originalFooter = document.jpdb.findElement('.footer');

    document.jpdb.withElements('.footer .menu .a', (e) => originalFooter.append(e));
    document.jpdb.withElements('#menu-footer, #menu-btn-footer, #menu-btn-control', (e) =>
      e.remove(),
    );
  }
}

new StickyNavbar();
