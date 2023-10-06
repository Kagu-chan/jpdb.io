import { JPDBPlugin } from '../plugin/jpdb-plugin';
import { PluginOptions } from '../plugin/types/plugin-options';
import {
  PluginUserOptions,
  PluginUserOptionFieldType,
  PluginUserOptionDependencyAction,
} from '../plugin/types/plugin-user-options';

enum ScrollControlOrder {
  BT = 'bottom-top',
  TB = 'top-bottom',
}

const ScrollControlOrderLabels: Record<ScrollControlOrder, string> = {
  [ScrollControlOrder.BT]: 'Bottom -> Top',
  [ScrollControlOrder.TB]: 'Top -> Bottom',
};

enum ScrollControlPosition {
  L = 'left',
  R = 'right',
  B = 'both',
}

const ScrollControlPositionLabels: Record<ScrollControlPosition, string> = {
  [ScrollControlPosition.L]: 'Left',
  [ScrollControlPosition.R]: 'Right',
  [ScrollControlPosition.B]: 'Left and Right',
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
  [
    typeof document.jpdb.prependElement | typeof document.jpdb.appendElement,
    '_containerLeft' | '_containerRight',
  ]
> = {
  left: [document.jpdb.prependElement, '_containerLeft'],
  right: [document.jpdb.appendElement, '_containerRight'],
};

export class ScrollControlsPlugin extends JPDBPlugin {
  protected _hasRan: boolean = false;

  protected _containerLeft: HTMLDivElement;
  protected _containerRight: HTMLDivElement;

  protected _pluginOptions: PluginOptions = {
    activeAt: [/.*/],
    canBeDisabled: true,
    name: 'Scroll controls',
    enableText: 'Enable scrolling controls on longer pages',
    runAgain: true,
  };

  protected _userSettings: PluginUserOptions = [
    {
      key: 'button-order',
      type: PluginUserOptionFieldType.RADIOBUTTON,
      options: ScrollControlOrder,
      labels: ScrollControlOrderLabels,
      default: ScrollControlOrder.BT,
      text: 'Scroll control order',
    },
    {
      key: 'button-position',
      type: PluginUserOptionFieldType.RADIOBUTTON,
      options: ScrollControlPosition,
      labels: ScrollControlPositionLabels,
      default: ScrollControlPosition.B,
      text: 'Scroll control position',
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
    const x: string = '';

    switch (x) {
      case '/settings':
        this.handleSettings();

        break;
      case '/prebuilt_decks':
        this.handleMedia();

        break;
      case '/deck-list':
        this.handleDecks();

        break;
      case '/review':
        /* NOP */
        break;
      default:
        if (this.getUsersSetting<boolean>('always-rerender')) {
          this.shiftFooter();
        }
    }

    this._hasRan = true;
  }

  protected handleSettings(): void {
    if (this._hasRan) {
      return;
    }

    if (!this.getUsersSetting<boolean>('in-settings')) {
      return;
    }

    this.addContainers(document.jpdb.findElement('#save-all-settings-box'));
    this.addScrollElement('left');
    this.addScrollElement('right');
  }

  protected handleMedia(): void {
    if (!this.getUsersSetting<boolean>('in-media-search')) {
      return;
    }

    this.addScrollControls();
  }

  protected handleDecks(): void {
    if (!this.getUsersSetting<boolean>('in-deck-list')) {
      return;
    }

    if (
      this.getUsersSetting<boolean>('set-threshold') &&
      this.countDecks() <= this.getUsersSetting<number>('threshold')
    ) {
      return;
    }

    this.addScrollControls();
  }

  protected countDecks(): number {
    // Find id's containing 'deck', but not 'l' (g"l"obal, b"l"acklisted) or 'n' ("n"ever-forgot)
    return document.jpdb.countElements("[id|='deck']:not([id*='l']):not([id*='n'])");
  }

  protected shiftFooter(): void {
    document.jpdb.adjacentElement('.container', 'afterend', {
      tag: 'div',
      style: { paddingBottom: '6rem' },
    });

    this.addContainers(
      document.jpdb.withElement('footer', (footer) => {
        const newFooter = document.jpdb.appendElement('body', {
          tag: 'div',
          id: 'deck-list-scroll-controls',
          innerHTML: footer.outerHTML,
        });

        footer.remove();

        return newFooter;
      }),
    );

    //     Globals.pluginManager.get(CSSPlugin).register(
    //       `${ScrollControlsPlugin.name}-footer`,
    //       `#deck-list-scroll-controls {
    //     position: fixed;
    //     left: 0;
    //     bottom: 0;
    //     width: 100%;
    //     background-color: var(--background-color);
    //     z-index: 999;
    //     display: flex;
    //     justify-content: center;
    //     padding-top: 1.2rem;
    // }`,
    //     );
  }

  protected addContainers(target: HTMLElement): void {
    this._containerLeft = document.jpdb.prependElement(target, {
      tag: 'div',
      class: ['sc-left', 'sc-any'],
    });
    this._containerRight = document.jpdb.appendElement(target, {
      tag: 'div',
      class: ['sc-right', 'sc-any'],
    });

    //     Globals.pluginManager.get(CSSPlugin).register(
    //       ScrollControlsPlugin.name,
    //       `
    // .sc-any {
    //   width:300px;
    // }

    // .sc-any input:not(:last-of-type) {
    //   margin-right: .5rem;
    // }

    // .sc-left {
    //   margin-right: auto;
    //   padding-left: 1.2rem;
    // }

    // .sc-right {
    //   margin-left: auto;
    //   padding-right: 1.2rem;
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: flex-end;
    // }
    // `,
    //     );
  }

  protected addScrollControls(): void {
    this.shiftFooter();

    this.addScrollElement('left');
    this.addScrollElement('right');
  }

  protected addScrollElement(lr: 'left' | 'right'): void {
    const direction = this.getUsersSetting<ScrollControlOrder>('button-order');
    const [target, text] = ScrollParameters[direction][lr];
    const [method] = ScrollStyles[lr];
    let [, containerName] = ScrollStyles[lr];

    switch (this.getUsersSetting<ScrollControlPosition>('button-position')) {
      case ScrollControlPosition.L:
        [, containerName] = ScrollStyles.left;

        break;
      case ScrollControlPosition.R:
        [, containerName] = ScrollStyles.right;

        break;
    }

    method(this[containerName], {
      tag: 'input',
      id: `scroll-${direction}`,
      class: ['outline', 'v2'],
      attributes: {
        type: 'submit',
        value: `To ${text}`,
      },
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
