import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import {
  PluginOptions,
  PluginUserOptionCheckbox,
  PluginUserOptionDependencyAction,
  PluginUserOptionFieldType,
  PluginUserOptions,
} from '../lib/types';

type CustomLink = {
  url: string;
  label: string;
};

const TOP_LINKS: CustomLink[] = [
  { url: '/prebuilt_decks', label: 'Built-in decks' },
  { url: '/stats', label: 'Stats' },
  { url: '/settings', label: 'Settings' },
  { url: '/logout', label: 'Logout' },
];
const BOTTOM_LINKS: CustomLink[] = [
  { url: '/about', label: 'About' },
  { url: '/faq', label: 'FAQ' },
  { url: '/contact-us', label: 'Contact us' },
  { url: '/privacy-policy', label: 'Privacy policy' },
  { url: '/terms-of-use', label: 'Terms of use' },
  { url: '/changelog', label: 'Changelog' },
  { url: '/labs', label: 'Labs' },
];

export class CustomLinksPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: /.*/,
    canBeDisabled: true,
    name: 'Custom Links',
    runAgain: true,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'top-links',
      text: 'Add header links',
      type: PluginUserOptionFieldType.OBJECTLIST,
      default: [],
      schema: [
        { key: 'url', label: 'URL', type: PluginUserOptionFieldType.TEXT },
        { key: 'label', label: 'Text', type: PluginUserOptionFieldType.TEXT },
      ],
    },
    {
      key: 'bottom-links',
      text: 'Add footer links',
      type: PluginUserOptionFieldType.OBJECTLIST,
      default: [],
      schema: [
        { key: 'url', label: 'URL', type: PluginUserOptionFieldType.TEXT },
        { key: 'label', label: 'Text', type: PluginUserOptionFieldType.TEXT },
      ],
    },
    {
      key: 'header-top',
      type: PluginUserOptionFieldType.HEADER,
      text: 'Hide links from top navigation',
    },
    ...TOP_LINKS.map(
      ({ url, label }): PluginUserOptionCheckbox => ({
        key: `hide-${url}`,
        text: `Hide '${label}' from header`,
        type: PluginUserOptionFieldType.CHECKBOX,
        default: false,
        indent: true,
        dependsOn: 'header-top',
        hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
        indentWith: '1rem',
      }),
    ),
    {
      key: 'header-bottom',
      type: PluginUserOptionFieldType.HEADER,
      text: 'Hide links from footer navigation',
    },
    ...BOTTOM_LINKS.map(
      ({ url, label }): PluginUserOptionCheckbox => ({
        key: `hide-${url}`,
        text: `Hide '${label}' from footer`,
        type: PluginUserOptionFieldType.CHECKBOX,
        default: false,
        indent: true,
        dependsOn: 'header-bottom',
        hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
        indentWith: '1rem',
      }),
    ),
  ];

  protected run(): void {
    const menu = this._dom.findOne('.menu');
    const footer = this._dom.findOne('footer');

    this.updateLinkList(menu, 'top-links', TOP_LINKS);
    this.updateLinkList(footer, 'bottom-links', BOTTOM_LINKS);
  }

  private updateLinkList(target: HTMLElement, settingKey: string, hideLinks: CustomLink[]): void {
    if (!target) return;

    this.getUsersSetting<CustomLink[]>(settingKey, []).forEach(({ url, label }) => {
      this._dom.adjacentNewElement('afterbegin', target, 'a', {
        class: ['nav-item'],
        innerText: label,
        attributes: {
          href: url,
        },
      });
    });

    hideLinks
      .filter(({ url }) => this.getUsersSetting<boolean>(`hide-${url}`, false))
      .forEach(({ url }) => this._dom.findOne(target, `a[href="${url}"]`, 'a')?.remove());
  }
}
