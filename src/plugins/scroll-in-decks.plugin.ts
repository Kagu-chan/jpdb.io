import { Globals } from '../lib/globals';
import { JPDBPlugin } from '../lib/plugin/jpdb-plugin';
import { PluginOptions, PluginUserOptions } from '../lib/types';
import { CSSPlugin } from './css.plugin';

export class ScrollInDecksPlugin extends JPDBPlugin {
  protected _pluginOptions: PluginOptions = {
    activeAt: '/deck-list',
    canBeDisabled: true,
    name: 'Scroll controls in deck list',
    enableText: 'Add <b>To top</b> and <b>To bottom</b> in deck list',
    runAgain: true,
  };
  protected _userSettings: PluginUserOptions = [
    {
      key: 'set-threshold',
      text: 'Only show after a certain deck threshold',
      type: 'checkbox',
      default: true,
    },
    {
      key: 'threshold',
      type: 'number',
      dependsOn: 'set-threshold',
      hideOrDisable: 'disable',
      indent: true,
      default: 50,
      description:
        'If you have less decks (or equal), the scroll controls wont be shown in the deck list',
    },
  ];

  protected run(): void {
    if (
      this.getUsersSetting<boolean>('set-threshold') &&
      this.countDecks() <= this.getUsersSetting<number>('threshold')
    )
      return;

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
      ScrollInDecksPlugin.name,
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

  protected countDecks(): number {
    // Find id's containing 'deck', but not 'l' (g"l"obal, b"l"acklisted) or 'n' ("n"ever-forgot)
    return this._dom.find("[id|='deck']:not([id*='l']):not([id*='n'])").length;
  }
}
