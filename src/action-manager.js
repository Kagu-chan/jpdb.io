// ==UserScript==
// @name         JPDB.io Actions Manager
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  JPDB.io Actions Manager
// @author       Kagu-chan
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

const JPDB = window.JPDBScriptRunner;
const { Deck, Script, Node, assign } = JPDB;

class NodeContainer {
  constructor(options, node) {
    this.options = options;
    this.node = node;
    this.actions = {};

    this.target = this.container ?? this.node;
  }

  createAction(name, options) {
    this.actions[name] = document.createElement('a');
    this.actions[name].style.display = 'none';

    assign(this.actions[name].style, this.options.style ?? {});

    this.target.append(this.actions[name]);
    this.updateAction(name, options);
  }

  updateAction(name, options) {
    const action = this.actions[name];

    action.innerText = options.text;
    action.onclick = options.callback;

    if (options.disabled) {
      action.setAttribute('disabled', '');
    } else {
      action.removeAttribute('disabled');
    }
  }

  deleteAction(name) {
    this.actions[name].delete();
    delete this.actions[name];
  }

  showAction(name) {
    this.actions[name].style.display = '';
  }

  hideAction(name) {
    this.actions[name].style.display = 'none';
  }
}

class NodeAction {
  constructor(container, name, text, callback) {
    this.container = container;
    this.name = name;
    this.text = text;
    this.callback = callback?.bind(undefined, this);
    this.disabled = !this.callback;

    this.container.createAction(this.name, {
      text,
      callback: this.callback,
      disabled: this.disabled,
    });
  }

  run() {
    this.callback?.();

    return this;
  }

  show() {
    this.container.showAction(this.name);

    return this;
  }

  hide() {
    this.container.hideAction(this.name);

    return this;
  }

  destroy() {
    this.container.deleteAction(this.name);
  }

  update(options) {
    this.text = options.text ?? this.text;
    this.callback = (options.callback ?? this.callback)?.bind(undefined, this);
    this.disabled = !this.callback;

    this.container.updateAction(this.name, {
      text: this.text,
      callback: this.callback,
      disabled: this.disabled,
    });

    return this;
  }
}

class Scope {
  path = window.location.pathname;
  active = false;

  actions = {};

  constructor(options, ...variants) {
    const variant = variants.find(({ on }) =>
      typeof on === 'string' ? on === this.path : on.test(this.path),
    );
    if (!variant) return;
    assign(options, variant);

    this.options = options;
    this.nodeContainer = new NodeContainer(
      this.options,
      Node.getNodes(this.options.select, undefined, 1),
    );
    this.active = true;
  }

  add(name, text, callback) {
    this.actions[name] =
      this.actions[name] || new NodeAction(this.nodeContainer, name, text, callback);

    return this.actions[name];
  }
}

class ActionsManager {
  path = window.location.pathname;

  scopes = {
    yourDecks: new Scope(
      {
        id: 'your-decks',
        style: { opacity: 0.5, 'margin-left': '12px', 'font-size': 'small', cursor: 'pointer' },
      },
      { on: '/learn', select: 'h4#deck_list' },
      { on: '/deck-list', select: '.container > h4' },
    ),
    deckActions: new Scope(
      { id: 'deck-actions' },
      { on: '/deck-list', select: '.container > div:first-of-type' },
    ),
  };

  addScope(key, options, ...variants) {
    this.scopes[key] = this.scopes[key] || new Scope(options, ...variants);
  }

  scope(name) {
    return this.scopes[name];
  }
}

JPDB.assign(JPDB, {
  actions: new ActionsManager(),
});
console.log(JPDB.actions);

// JPDB.add(class HideCompletedDecks extends Script('/learn', '/deck-list') {
//     style = 'opacity: .5;margin-left:12px;font-size: small;cursor: pointer;';

//     constructor() {
//         super();

//         this.hides = [];
//         this.show = false;
//     }

//     run() {
//         this.hides = Deck.getDecks().filter((deck) => {
//             const rec = deck.getRecognition();

//             return rec >= 100;
//         }).map(({ node }) => node);

//         this.hideDecks();

//         return true;
//     }

//     hideDecks() {
//         Node.hide(...this.hides);
//         this.show = false;

//         this.updateControls();
//     }

//     showDecks() {
//         Node.display(...this.hides);
//         this.show = true;

//         this.updateControls();
//     }

//     updateControls() {
//         const { length: l } = this.hides;

//         const deckText = l > 1 ? 'decks' : 'deck';
//         const text = this.show ? `Hide ${l} completed ${deckText}` : `Show ${l} completed ${deckText}`;
//         const [yourDecks] = Node.getNodes(this.pathname === '/learn' ? 'h4#deck_list' : '.container > h4');
//         const [, link] = yourDecks.childNodes;

//         if (!l) return;

//         link?.remove();
//         yourDecks.innerHTML = `${yourDecks.innerHTML}<a style="${this.style}">${text}</a>`;

//         yourDecks.childNodes[1].onclick = () => this.show? this.hideDecks() : this.showDecks();
//     }
// });
