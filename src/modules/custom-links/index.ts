interface CustomLink {
  url: string;
  label: string;
}

/**
 * add or remove custom links for header and footer
 */
class CustomLinks {
  private TOP_LINKS: CustomLink[] = [
    { url: '/prebuilt_decks', label: 'Built-in decks' },
    { url: '/stats', label: 'Stats' },
    { url: '/settings', label: 'Settings' },
    { url: '/logout', label: 'Logout' },
  ];
  private BOTTOM_LINKS: CustomLink[] = [
    { url: '/about', label: 'About' },
    { url: '/faq', label: 'FAQ' },
    { url: '/contact-us', label: 'Contact us' },
    { url: '/privacy-policy', label: 'Privacy policy' },
    { url: '/terms-of-use', label: 'Terms of use' },
    { url: '/changelog', label: 'Changelog' },
  ];

  constructor() {
    jpdb.settings.renameModuleSetting('custom-links', CustomLinks.name);

    if (jpdb.settings.hasPatreonPerks()) {
      this.BOTTOM_LINKS.push({ url: '/labs', label: 'Labs' });
    }

    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: CustomLinks.name,
      category: 'Navigation',
      displayText: 'Custom Links',
      description: 'Allows changing the links in header and footer',
      experimental: true,
      options: [
        {
          key: 'header',
          type: 'objectlist',
          default: this.TOP_LINKS,
          schema: [
            {
              key: 'url',
              label: 'URL',
              type: 'text',
            },
            {
              key: 'label',
              label: 'Text',
              type: 'text',
            },
          ],
          text: 'Header navigation',
          description: [
            // eslint-disable-next-line max-len
            '<div>Change the header links to your likings by adding, removing or rearrangig them here.</div>',
            '<div>The learn button cannot be changed.</div>',
            '<div>&nbsp;&nbsp;</div>',
            '<div>The defaults are as follows:</div>',
            '<div><ul>',
            ...this.TOP_LINKS.map((a) => `<li><b>${a.label}</b> -> <code>${a.url}</code></li>`),
            '</ul></div>',
            '<div>&nbsp;&nbsp;</div>',
            '<div>Some normally hidden links would be:</div>',
            '<div><ul>',
            ...[
              ['Anime difficulty list', '/anime-difficulty-list'],
              ['Novel difficulty list', '/novel-difficulty-list'],
              ['Visual novel difficulty list', '/visual-novel-difficulty-list'],
              ['Web novel diffuculty list', '/web-novel-difficulty-list'],
              ['Live action difficulty list', '/live-action-difficulty-list'],
              ['Kanken kanji list', '/kanken-kanji'],
              ['Kanji frequency list', '/kanji-by-frequency'],
              ['Text analyzer', '/analyze-text'],
            ].map(([text, link]) => `<li><b>${text}</b> -> <code>${link}</code></li>`),
            '</ul></div>',
          ].join(''),
        },
        {
          key: 'footer',
          type: 'objectlist',
          default: this.BOTTOM_LINKS,
          schema: [
            {
              key: 'url',
              label: 'URL',
              type: 'text',
            },
            {
              key: 'label',
              label: 'Text',
              type: 'text',
            },
          ],
          text: 'Footer navigation',
          description: [
            // eslint-disable-next-line max-len
            '<div>Change the footer links to your likings by adding, removing or rearrangig them here.</div>',
            '<div>&nbsp;&nbsp;</div>',
            '<div>The defaults are as follows:</div>',
            '<div><ul>',
            ...this.BOTTOM_LINKS.map((a) => `<li><b>${a.label}</b> -> <code>${a.url}</code></li>`),
            '</ul></div>',
          ].join(''),
        },
      ],
    });
  }

  private addListeners(): void {
    jpdb.runOnceOnEnable('/settings', CustomLinks.name, () => {
      document.jpdb.withElements('.nav > .menu a', (a) => a.classList.add('hidden'));

      this.addHeaderLinks();

      jpdb.on(`update-${CustomLinks.name}-header`, () => {
        document.jpdb.withElements('.nav > .menu a', (a) => {
          if (a.classList.contains('hidden')) {
            return;
          }

          a.remove();
        });

        this.addHeaderLinks();
      });
    });
    jpdb.runOnceOnDisable('/settings', CustomLinks.name, () => {
      document.jpdb.withElements('.nav > .menu a', (a) => {
        if (a.classList.contains('hidden')) {
          a.classList.remove('hidden');

          return;
        }

        a.remove();
      });
    });

    jpdb.runOnceWhenActive(/^(?!\/settings)/, CustomLinks.name, () => {
      document.jpdb.withElements('.nav > .menu a', (a) => a.remove());
      document.jpdb.withElements('.footer a', (a) => a.remove());

      this.addHeaderLinks();
      this.addFooterLinks();
    });
  }

  private addHeaderLinks(): void {
    jpdb.settings.persistence
      .getModuleOption<CustomLink[]>(CustomLinks.name, 'header')
      .forEach((link) => {
        const anchor = document.jpdb.appendElement('.menu', {
          tag: 'a',
          innerText: link.label,
          class: 'nav-item',
          attributes: {
            href: link.url,
          },
        });

        if (link.url.startsWith('http') && !link.url.includes('jpdb.io')) {
          anchor.setAttribute('target', '_blank');
        }
      });
  }

  private addFooterLinks(): void {
    jpdb.settings.persistence
      .getModuleOption<CustomLink[]>(CustomLinks.name, 'footer')
      .forEach((link) => {
        const anchor = document.jpdb.appendElement('.footer', {
          tag: 'a',
          innerText: link.label,
          attributes: {
            href: link.url,
          },
        });

        if (link.url.startsWith('http') && !link.url.includes('jpdb.io')) {
          anchor.setAttribute('target', '_blank');
        }
      });
  }
}

new CustomLinks();
