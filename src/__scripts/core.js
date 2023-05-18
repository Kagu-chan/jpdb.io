// ==UserScript==
// @name         JPDB.io _Core
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Runs scripts for JPDB.io
// @author       Kagu-chan
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

const assign = (target, source) => {
  Object.keys(source).forEach((key) => (target[key] = source[key]));

  return target;
};

const Node = class {
  static getNodes(query, ctor, limit) {
    return this.getChildNodes(document, query, ctor, limit);
  }

  static getChildNodes(parent, query, ctor, limit) {
    let result = Array.from(parent.querySelectorAll(query));

    if (limit) result = result.slice(0, limit);

    const resultData = result.map((node, index) => (ctor ? new ctor(node, index) : node));
    return limit === 1 ? resultData?.[0] : resultData;
  }

  static hide(...nodes) {
    nodes.forEach((node) => (node.style.display = 'none'));
  }

  static display(...nodes) {
    nodes.forEach((node) => (node.style.display = ''));
  }
};

const Deck = class {
  static Coverage = class {
    constructor(node) {
      this.nodes = { node };

      const [vocab, coverage] = Node.getChildNodes(this.nodes.node, '.deck-body > div > div > div');
      const info = vocab
        ? undefined
        : Node.getChildNodes(this.nodes.node, '.deck-body > div', undefined, 1);

      assign(this.nodes, { vocab, coverage, info });

      if (!this.nodes.vocab) return this.setWordsFromInfo();
      this.applyData();
    }

    setWordsFromInfo() {
      this.words = this.wordsMax = Number(this.nodes.info.childNodes[1].innerText);
    }

    applyData() {
      this.setWordData();
      this.setVocabData();
      this.setCoverageData();
    }

    setWordData() {
      const [words, wordsMax] = this.nodes.vocab.childNodes[0].childNodes[1].innerHTML
        .split(Deck.WORD_SEPARATOR)
        .map((e) => Number(e));

      assign(this, { words, wordsMax });
    }

    setVocabData() {
      this.vocab = this.getCoverageData(this.nodes.vocab);
    }

    setCoverageData() {
      this.coverage = this.nodes.coverage ? this.getCoverageData(this.nodes.coverage) : this.vocab;
    }

    getCoverageData(node) {
      const tooltips = Node.getChildNodes(node, '.tooltip').map(({ dataset }) => dataset.tooltip);
      const data = {};

      tooltips.forEach((e) => {
        const [key, val] = e.split(': ');

        data[key] = Number(val.replace('%', ''));
      });

      const known = data.Known ?? 0;
      const prog = data['In progress'] ?? 0;

      return {
        known,
        prog: known + prog,
        new: data.New ?? 0,
      };
    }
  };

  static DEFAULT_DECKS = ['deck-global', 'deck-blacklisted', 'deck-never-forget'];
  static WORD_SEPARATOR = /[^\d]+/;

  static getDecks(withGlobal) {
    const decks = Node.getNodes('.deck', Deck);

    return withGlobal ? decks : decks.filter(({ isDefaultDeck }) => !isDefaultDeck);
  }

  constructor(node, index) {
    this.node = node;
    this.pos = index;
    this.isDefaultDeck = Deck.DEFAULT_DECKS.includes(this.node.id);

    this.titleNode = node.querySelector('.deck-main .deck-title a');

    this.id = Number(node.id.replace('deck-', ''));
    this.title = this.titleNode.innerText.replace(/^\d+\.\s/, '');
    this.cov = new Deck.Coverage(this.node); // this.getCoverageStats(node);
  }

  getCoverage() {
    return this.cov.coverage.known;
  }

  getRecognition() {
    return this.cov.coverage.prog;
  }
};

const Script = (...activeAt) =>
  class {
    static activeAt = activeAt;
    static path = window.location.pathname;
    static isActive() {
      return !!this.activeAt.find((expression) =>
        typeof expression === 'string' ? expression === this.path : expression.test(this.path),
      );
    }

    constructor() {
      this.pathname = Script.path;
    }

    run() {
      return false;
    }

    getNodes = Node.getNodes;
    getChildNodes = Node.getChildNodes;
  };

const JPDB = class {
  static VERSION = '0.0.1';

  static VIRTUAL_REFRESH = 'virtual-refresh';
  static SCRIPTS = [];

  static instance;
  static getInstance() {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  static HelloWorld = class extends Script(/.*/) {
    run() {
      console.log(`JPDBScriptRunner v${JPDB.VERSION} running`);

      return false;
    }
  };

  constructor() {
    this.scripts = [];

    document.addEventListener(JPDB.VIRTUAL_REFRESH, () => this.runScripts());
  }

  add = (script) => {
    if (script.isActive()) {
      const instance = new script();

      if (instance.run()) {
        this.scripts.push(instance);
      }
    }
  };

  runScripts = () => (this.scripts = this.scripts.filter((s) => s.run()));
};

JPDB.getInstance().add(JPDB.HelloWorld);
window.JPDBScriptRunner = {
  add: (script) => JPDB.getInstance().add(script),
  Script,
  Deck,
  Node,
  assign,
};
