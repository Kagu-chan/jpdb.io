interface CustomLink {
  url: string;
  label: string;
}

/**
 * add or remove custom links for header and footer
 */
class CustomLinks {
  private CUSTOM_LINKS: string = 'custom-links';
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
    if (jpdb.settings.hasPatreonPerks()) {
      this.BOTTOM_LINKS.push({ url: '/labs', label: 'Labs' });
    }

    this.register();

    this.addListeners();
  }

  private register(): void {
    jpdb.settings.moduleManager.register({
      name: this.CUSTOM_LINKS,
      category: 'Navigation',
      displayText: 'Custom Links',
      description: 'Allows changing the links in header and footer',
      experimental: true,
      options: [
        {
          key: 'test1',
          type: 'stringlist',
          text: 'Test List',
          default: [],
        },
        {
          key: 'test2',
          type: 'numberlist',
          text: 'Test Number List',
          default: [],
        },
        {
          key: 'test3',
          type: 'objectlist',
          text: 'Object Boolean List',
          default: [],
          schema: [
            { key: 'a', label: 'a', type: 'text' },
            { key: 'b', label: 'b', type: 'number', min: 0, max: 5 },
            { key: 'c', label: 'c', type: 'boolean' },
          ],
        },
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
        },
      ],
    });
  }

  private addListeners(): void {
    /* NOP */
  }
}

new CustomLinks();
