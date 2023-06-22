import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import {
  PluginOptions,
  PluginUserOptionDependencyAction,
  PluginUserOptionFieldType,
  PluginUserOptions,
} from '../lib/types';
import { CSSPlugin } from './css/css.plugin';

enum ScrollControlOrder {
  BT = 'bottom-top',
  TB = 'top-bottom',
}

const ScrollControlLabels: Record<ScrollControlOrder, string> = {
  [ScrollControlOrder.BT]: 'Bottom left, Top right',
  [ScrollControlOrder.TB]: 'Top left, Bottom right',
};

const ScrollParameters: Record<
  ScrollControlOrder,
  Record<'left' | 'right', [() => number, string]>
> = {
  [ScrollControlOrder.BT]: {
    left: [(): number => document.body.scrollHeight, 'bottom'],
    right: [(): number => 0, 'top'],
  },
  [ScrollControlOrder.TB]: {
    left: [(): number => 0, 'top'],
    right: [(): number => document.body.scrollHeight, 'bottom'],
  },
};

const ScrollStyles: Record<
  'left' | 'right',
  [string[], Pick<CSSStyleDeclaration, 'marginLeft' | 'marginRight'>]
> = {
  left: [[], { marginLeft: '1.2rem', marginRight: 'auto' }],
  right: [['scroll', 'right'], { marginLeft: 'auto', marginRight: '1.2rem' }],
};

export class ScrollControlsPlugin extends JPDBPlugin {
  protected _hasRan: boolean = false;
  protected _footer: HTMLDivElement;

  protected _pluginOptions: PluginOptions = {
    activeAt: [/.*/],
    canBeDisabled: true,
    name: 'Scroll controls',
    enableText: 'Enable scrolling controls on longer pages',
    runAgain: true,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'button-position',
      type: PluginUserOptionFieldType.RADIOBUTTON,
      options: ScrollControlOrder,
      labels: ScrollControlLabels,
      default: ScrollControlOrder.BT,
      text: 'Control order',
    },
    {
      key: 'in-settings',
      type: PluginUserOptionFieldType.CHECKBOX,
      text: 'Enable in settings',
    },
    {
      key: 'in-media-search',
      type: PluginUserOptionFieldType.CHECKBOX,
      text: 'Enable in media search',
    },
    {
      key: 'in-deck-list',
      type: PluginUserOptionFieldType.CHECKBOX,
      text: 'Enable in deck list',
    },
    {
      key: 'set-threshold',
      text: 'Only show after a certain deck threshold',
      type: PluginUserOptionFieldType.CHECKBOX,
      dependsOn: 'in-deck-list',
      default: true,
      indent: true,
      hideOrDisable: PluginUserOptionDependencyAction.HIDE,
    },
    {
      key: 'threshold',
      type: PluginUserOptionFieldType.NUMBER,
      dependsOn: 'set-threshold',
      hideOrDisable: PluginUserOptionDependencyAction.DISABLE,
      indent: true,
      default: 50,
      description:
        'If you have less decks (or equal), the scroll controls wont be shown in the deck list',
    },
    {
      key: 'always-rerender',
      text: 'Always re-render footer',
      type: PluginUserOptionFieldType.CHECKBOX,
      default: false,
      description:
        // eslint-disable-next-line max-len
        'Re-renders the footer navigation to be always visible except when reviewing or in settings',
    },
  ];

  protected run(): void {
    switch (this.PATH) {
      case '/settings':
        this.handleSettings();

        break;
      case '/prebuilt_decks':
        this.handleMedia();

        break;
      case '/deck-list':
        this.handleDecks();

        break;

      default:
        if (this.getUsersSetting<boolean>('always-rerender')) this.shiftFooter();
    }

    this._hasRan = true;
  }

  protected handleSettings(): void {
    if (this._hasRan) return;
    if (!this.getUsersSetting<boolean>('in-settings')) return;

    const container = this._dom.findOne('#save-all-settings-box');

    this._dom.prependElement(container, this.getScrollElement('left'));
    this._dom.appendElement(container, this.getScrollElement('right'));
  }

  protected handleMedia(): void {
    if (!this.getUsersSetting<boolean>('in-media-search')) return;

    this.addScrollControls();
  }

  protected handleDecks(): void {
    if (!this.getUsersSetting<boolean>('in-deck-list')) return;
    if (
      this.getUsersSetting<boolean>('set-threshold') &&
      this.countDecks() <= this.getUsersSetting<number>('threshold')
    )
      return;

    this.addScrollControls();
  }

  protected countDecks(): number {
    // Find id's containing 'deck', but not 'l' (g"l"obal, b"l"acklisted) or 'n' ("n"ever-forgot)
    return this._dom.find("[id|='deck']:not([id*='l']):not([id*='n'])").length;
  }

  protected shiftFooter(): void {
    const container = this._dom.findOne('.container');
    const footer = this._dom.findOne('footer');
    this._footer = this._dom.appendNewElement(this._body, 'div', {
      id: 'deck-list-scroll-controls',
      innerHTML: footer.outerHTML,
    });

    footer.remove();
    this._dom.adjacentNewElement('afterend', container, 'div', {
      style: {
        paddingBottom: '6rem',
      },
    });

    Globals.pluginManager.get(CSSPlugin).register(
      ScrollControlsPlugin.name,
      `#deck-list-scroll-controls {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: var(--background-color);
    z-index: 999;
    display: flex;
    justify-content: center;
    padding-top: 1.2rem;
}`,
    );
  }

  protected addScrollControls(): void {
    this.shiftFooter();

    this._dom.prependElement(this._footer, this.getScrollElement('left'));
    this._dom.appendElement(this._footer, this.getScrollElement('right'));
  }

  protected getScrollElement(lr: 'left' | 'right'): HTMLInputElement {
    const direction = this.getUsersSetting<ScrollControlOrder>('button-position');
    const [extraClasses, style] = ScrollStyles[lr];
    const [target, text] = ScrollParameters[direction][lr];

    return this._dom.createElement('input', {
      id: `scroll-${direction}`,
      class: ['outline', 'v2', ...extraClasses],
      attributes: {
        type: 'submit',
        value: `To ${text}`,
      },
      style,
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({
          top: target(),
          behavior: 'smooth',
        });
      },
    });
  }
}
