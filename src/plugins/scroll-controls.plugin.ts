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

export class ScrollControlsPlugin extends JPDBPlugin {
  protected _hasRan: boolean = false;

  protected _pluginOptions: PluginOptions = {
    activeAt: ['/settings', '/deck-list', '/prebuilt_decks'],
    canBeDisabled: true,
    name: 'Scroll controls',
    enableText: 'Enable scrolling controls on longer pages',
    runAgain: true,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'buttom-position',
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
    }

    this._hasRan = true;
  }

  protected handleSettings(): void {
    if (this._hasRan) return;
    if (!this.getUsersSetting<boolean>('in-settings')) return;

    const container = this._dom.findOne('#save-all-settings-box');

    this._dom.prependNewElement(container, 'input', {
      id: 'scroll-down',
      class: ['outline', 'v2'],
      attributes: {
        type: 'submit',
        value: 'To Bottom',
      },
      style: {
        marginLeft: '1.2rem',
        marginRight: 'auto',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      },
    });

    this._dom.appendNewElement(container, 'input', {
      id: 'scroll-up',
      class: ['outline', 'v2', 'scroll', 'right'],
      attributes: {
        type: 'submit',
        value: 'To Top',
      },
      style: {
        marginLeft: 'auto',
        marginRight: '1.2rem',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
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

  protected addScrollControls(): void {
    const container = this._dom.findOne('.container');
    const footer = this._dom.findOne('footer');
    const div = this._dom.appendNewElement(this._body, 'div', {
      id: 'deck-list-scroll-controls',
      innerHTML: footer.outerHTML,
    });

    footer.remove();
    this._dom.adjacentNewElement('afterend', container, 'div', {
      style: {
        paddingBottom: '6rem',
      },
    });

    this._dom.prependNewElement(div, 'input', {
      id: 'scroll-down',
      class: ['outline', 'v2'],
      attributes: {
        type: 'submit',
        value: 'To bottom',
      },
      style: {
        marginLeft: '1.2rem',
        marginRight: 'auto',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      },
    });

    this._dom.appendNewElement(div, 'input', {
      id: 'scroll-up',
      class: ['outline', 'v2', 'scroll', 'right'],
      attributes: {
        type: 'submit',
        value: 'To top',
      },
      style: {
        marginLeft: 'auto',
        marginRight: '1.2rem',
      },
      handler: (ev) => {
        ev.preventDefault();

        window.scrollTo({ top: 0, behavior: 'smooth' });
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
}
