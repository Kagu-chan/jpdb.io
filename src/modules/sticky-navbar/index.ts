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

    jpdb.runOnceOnEnable(/^(?!\/(review|settings))/, this.STICKY_FOOTER, () =>
      this.addStickyFooter(),
    );
    jpdb.runOnceOnDisable(/^(?!\/(review|settings))/, this.STICKY_FOOTER, () =>
      this.removeStickyFooter(),
    );

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
      // eslint-disable-next-line @typescript-eslint/unbound-method
      add_and_run_event_listener(document, 'resize', this.resizeFooterSpacer);

      document.jpdb.adjacentElement('body', 'beforeend', {
        tag: 'div',
        class: 'footer-spacer',
        style: {},
      });
    });

    jpdb.css.add({
      key: this.STICKY_FOOTER,
      css: __load_css('./src/modules/sticky-navbar/footer.css'),
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
}

new StickyNavbar();
