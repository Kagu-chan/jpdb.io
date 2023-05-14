// ==UserScript==
// @name         Deck Sorter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Sort decks based on expression | recognition => coverage | expression
// @author       Kagu-chan
// @match        https://jpdb.io/deck-list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

// ##### CONFIGURATION #####
/**
 * Add your sorting preferences here!
 *
 * TOP_DECKS will be sorted to the beginning, BOTTOM_DECKS to the end. Leave as empty array to ignore those
 * Everything else will be sorted by Coverage (if not disabled), then by Vocabulary
 *
 * Specifying TOP and BOTTOM Decks:
 * - Add a simple String Value ('Value') - This will be an exact match
 * - Add a regular expression (/pattern/i) - This will be an pattern match
 * - Add a regular expression with capture group (/pattern(?<NAME>PATTERN)/i) - This will be a pattern match and the found items will be sorted according to its group name by the group match:
 * -> 'asc'     - sorts by number ASC
 * -> 'desc'    - sorts by number DESC
 * -> 'text'    - sorts alphabetically
 * -> 'default' - sorts by Coverage (if not disabled), then by Vocabulary
 *
 * SAMPLES:
 * /Club (?<asc>\d+):/i             // Decks match 'Club ' + a number + ':' (JPDB Anime Club XX: Title) - sorted ASC by the given number
 * /- N(?<desc>\d)$/i,              //  Decks ending with '- N' plus a number (The JPDB JLPT Decks) - sorted DESC by the given number
 * /^(?<text>[^\s]*)$/i,            // Sample to filter decks without whitespaces and then sorting them alphabetically
 * /^(?<default>[^\s]+\s[^\s]+)$/i, // Sample to filter decks with exactly one whitespace and no special characters, sorting them by Coverage
 */

// Decks to put to the TOP
const TOP_DECKS = [
  /^Prio:/i, // If there is a deck starting with 'Prio:', move it to the top
  /1K/i, //     Deck containing '1K' (in this case, 1K Frequency list) - this is a shortcut for writing out the name completely
  /N5/i, //     Deck containing 'N5' (in this case, the JLPT N5 Deck)
  'Mining', //  'Mining' Deck
  'Refold', //  'Refold' Deck
];

// Decks to put to the BOTTOM
const BOTTOM_DECKS = [
  /10K/i, //                   Deck containing '10K' (in this case, 10K Frequency list)
  /- N(?<desc>\d)$/i, //       Decks ending with '- N' plus a number (The other JLPT Decks) - sorted DESC by the given number
  /Club (?<default>\d+):/i, // Decks match 'Club ' + a number + ':' (JPDB Anime Club XX: Title) - sorted by Coverage
  'Graveyard', //              Decks I dont learn anymore
];

// 'default' decks and all other (non sorted) decks will be sorted by Coverage (if enabled), then by Vocabulary
const SORT_BY_COV = true;

// When sorting by Coverage or Vocab, REC (Recognition) will first sort by the targeted value (the one in parentheses), then the actual value (left)
const SORT_BY_REC = true;

// Automatic Sorting on (true) or off (false) - if ON, on decklist enter the decks will be sorted if not already. if OFF, a new Menu item will be added to sort
const AUTO_SORT = false;

// If true, no actual requests are send to the server, but the results are sill logged to the console
const SIMULATE = false;

// If this CAP is reached, the script will cancel - please keep in mind the https://jpdb.io/terms-of-use Terms of use
const HARD_CAP = 100;

// ##### END CONFIGURATION #####

class DeckSorter {
  constructor() {
    // Default sorting - fetch all and assign default
    this.defaultSorter = /^(?<default>.*)$/i;

    // Sorted deck lists
    this.topDecks = [];
    this.bottomDecks = [];
    this.middleDecks = [];

    // Actual sorting instructions for the server
    this.instructions = [];
    this.iterations = 0;

    // Auxiliary data
    this.deckNodes = Array.from(document.querySelectorAll('div.deck')).slice(0, -3);
    this.allDecks = this.deckNodes.map(this.deckNodeToObject.bind(this));
  }

  deckNodeToObject(node, pos) {
    const titleBlock = node.querySelector('.deck-main .deck-title a');
    const title = titleBlock.innerHTML.replace(/\d+\.\s/, '');
    const cov = this.getCoverageStats(node);
    const id = Number(node.id.replace('deck-', ''));

    console.debug('Convert deck node to object', { title, id, cov });
    return {
      pos,
      id,
      title,
      object: node,
      cov,
    };
  }

  sort() {
    console.debug('Sort TOP_DECKS', TOP_DECKS, this.allDecks.length, 'decks total');
    this.findAndSort(TOP_DECKS, this.topDecks);

    console.debug('Sort BOTTOM_DECKS', BOTTOM_DECKS, this.allDecks.length, 'decks left');
    this.findAndSort(BOTTOM_DECKS, this.bottomDecks);

    console.debug('Sort MIDDLE_DECKS', this.allDecks.length, 'to sort');
    this.findAndSortElement(this.defaultSorter, this.middleDecks);

    this.buildWorkingDeckList();
    this.findOptimalDeltas();

    console.debug('Instructions found', this.instructions);
  }

  submitSort() {
    console.log(
      `Found ${this.instructions.length} sorting instructions to sort your JPDB Deck List`,
    );

    if (this.iterations < HARD_CAP && this.instructions.length && !SIMULATE) {
      console.debug('Start pushing sort instructions to server...');
      this.sortDecksRemote();
    }

    console.log(`Done executing ${this.instructions.length} sorting instructions`);
  }

  buildWorkingDeckList() {
    const decks = [this.topDecks, this.middleDecks, this.bottomDecks].flat();

    this.workingList = [];
    decks.forEach(({ pos, id, title }, index) => {
      const distance = index - pos;
      console.debug('Calculated starting delta for deck', { id, distance, title });

      this.workingList[pos] = { current: pos, target: index, distance, id, title };
    });
  }

  findOptimalDeltas() {
    const moveData = this.findMaxDistance();
    console.debug('Next Moving object', moveData);

    if (moveData.minDis === moveData.maxDis && moveData.minDis === 0) return;

    moveData.minDis >= moveData.maxDis
      ? this.moveUp(moveData.minIndex, moveData.min)
      : this.moveDown(moveData.maxIndex, moveData.max);

    this.findOptimalDeltas();
  }

  findMaxDistance() {
    let min = undefined;
    let minIndex = 0;
    let max = undefined;
    let maxIndex = 0;

    this.workingList.forEach(({ distance }, index) => {
      if (max === undefined || distance > max) {
        max = distance;
        maxIndex = index;
        return;
      }
      if (min === undefined || distance < min) {
        min = distance;
        minIndex = index;
        return;
      }
    });

    return { min, minDis: Math.abs(min), minIndex, max, maxDis: Math.abs(max), maxIndex };
  }

  moveUp(index, distance) {
    const startIndex = index + distance;
    const endIndex = index;
    const [element] = this.workingList.splice(index, 1);

    console.debug('Move deck %s (%s) up by %s', element.id, element.title, Math.abs(distance));
    this.instructions.push({ id: element.id, delta: distance, origin: '/deck-list' });

    element.current = startIndex;
    element.distance = 0;

    this.workingList.splice(startIndex, 0, element);
    for (let i = startIndex + 1; i <= endIndex; i++) {
      this.workingList[i].current += 1;
      this.workingList[i].distance -= 1;
    }
  }

  moveDown(index, distance) {
    const startIndex = index;
    const endIndex = index + distance;
    const [element] = this.workingList.splice(index, 1);

    console.debug('Move deck %s (%s) down by %s', element.id, element.title, Math.abs(distance));
    this.instructions.push({ id: element.id, delta: distance, origin: '/deck-list' });

    element.current = endIndex;
    element.distance = 0;

    this.workingList.splice(endIndex, 0, element);
    for (let i = startIndex; i < endIndex; i++) {
      this.workingList[i].current -= 1;
      this.workingList[i].distance += 1;
    }
  }

  sortDecksRemote() {
    const instruction = this.instructions.shift();
    console.debug('Send sort command to server', instruction);

    // eslint-disable-next-line no-undef
    xhr('POST', 'https://jpdb.io/change_deck_priority', instruction, () => {
      if (this.instructions.length) {
        this.sortDecksRemote();
      } else {
        console.debug('Trigger refresh of deck list');

        // eslint-disable-next-line no-undef
        virtual_refresh();
      }
    });
  }

  findAndSort(expressions, target) {
    for (const expression of expressions) {
      this.findAndSortElement(expression, target);
    }
  }

  findAndSortElement(expression, target) {
    console.debug('Sort elements by expression `%s`', expression);
    let moved;

    if (typeof expression === 'string') {
      moved = this.moveDeckByName(expression, target);
    } else {
      moved = this.moveDecksByExpression(expression, target);
    }

    this.removeFromSource(Array.isArray(moved) ? moved.map(({ id }) => id) : moved?.id);
  }

  moveDeckByName(name, target) {
    console.debug('Search deck `%s`', name);
    const deck = this.allDecks.find(({ title }) => title === name);

    if (!deck) return;

    console.debug('Found deck `%s`, saving in collection', name);
    target.push(deck);

    return deck;
  }

  moveDecksByExpression(expression, target) {
    console.debug('Search decks by expression `%s`', expression);
    const sortList = [];
    let moveList = [];

    this.allDecks.forEach((deck) => {
      const matchResult = expression.exec(deck.title);

      if (!matchResult) return;

      console.debug('Found deck `%s` by expression `%s`', deck.title, expression);
      if (!matchResult.groups) return moveList.push(deck);

      console.debug('Save deck `%s` for sorting', deck.title, matchResult.groups);
      sortList.push({ e: deck, m: matchResult.groups });
    });

    if (sortList.length) {
      moveList = this.sortCaptureGroup(sortList);
    }
    moveList.forEach((e) => target.push(e));

    return moveList;
  }

  sortCaptureGroup(sortList) {
    const num = (l, r, m) => {
      const ln = Number(l);
      const rn = Number(r);

      return ln === rn ? 0 : ln > rn ? m : m * -1;
    };

    const sorters = {
      asc: ([l], [r]) => num(l, r, 1),
      desc: ([l], [r]) => num(l, r, -1),
      text: ([l], [r]) => (l === r ? 0 : l > r ? 1 : -1),
      default: (l, r) => this.sortByCoverage(l, r),
    };

    console.debug(
      'Sort deck list (Mode: %s; Items: %s)...',
      Object.keys(sortList[0]?.m ?? {})[0],
      sortList.length,
    );
    return sortList
      .sort((left, right) => {
        // * -> 'asc'     - sorts by number ASC
        // * -> 'desc'    - sorts by number DESC
        // * -> 'text'    - sorts alphabetically
        // * -> 'default' - sorts by Coverage (if not disabled), then by Vocabulary
        const [mode] = Object.keys(left.m);

        const vl = left.m[mode];
        const vr = right.m[mode];

        return sorters[mode]?.([vl, left], [vr, right]) ?? 0;
      })
      .map(({ e }) => e);
  }

  sortByCoverage([, left], [, right]) {
    const { cov: l } = left.e;
    const { cov: r } = right.e;
    const comp = (a, b) => (a < b ? 1 : -1);

    if (SORT_BY_COV) {
      if (SORT_BY_REC && l.cp !== r.cp) return comp(l.cp, r.cp);
      if (l.ck !== r.ck) return comp(l.ck, r.ck);
    }

    if (SORT_BY_REC && l.vp !== r.vp) return comp(l.vp, r.vp);
    if (l.vk !== r.vk) return comp(l.vk, r.vk);

    return l.w === r.w ? 0 : comp(l.w, r.w);
  }

  getCoverageStats(node) {
    const [vocabNode, covNode] = Array.from(node.querySelectorAll('.deck-body > div > div > div'));
    const words = Number(vocabNode.childNodes[0].childNodes[1].innerHTML.split('&')[0]);

    const vocabData = this.getCoverageData(vocabNode);
    const covData = covNode ? this.getCoverageData(covNode) : vocabData;

    return {
      vk: vocabData.known,
      vp: vocabData.prog,
      vn: vocabData.new,
      ck: covData.known,
      cp: covData.prog,
      cn: covData.new,
      w: words,
    };
  }

  getCoverageData(node) {
    const data = {};

    Array.from(node.querySelectorAll('.tooltip'))
      .map(({ dataset }) => dataset.tooltip)
      .forEach((e) => {
        const [key, val] = e.split(': ');

        data[key] = Number(val.replace('%', ''));
      });

    return {
      known: data.Known,
      prog: data.Known + (data['In progress'] ?? 0),
      new: data.New,
    };
  }

  removeFromSource(ids) {
    if (!ids && !ids?.length) return;
    if (!Array.isArray(ids)) ids = [ids];

    this.allDecks = this.allDecks.filter(({ id }) => !ids.includes(id));
  }

  attachToDom() {
    if (!this.instructions.length) return;

    console.debug('Add clickable object to deck controls');
    const menu = document.querySelector('body > div.container.bugfix > div:nth-child(2)');
    const newEl = `<a style="flex-grow: 1;" class="outline" href="javascript:sortDecks()">Sort Decks (${this.instructions.length})</a>`;

    window.sortDecks = this.submitSort.bind(this);
    menu.innerHTML = `${menu.innerHTML}${newEl}`;
  }
}

(function () {
  'use strict';

  const deckSorter = new DeckSorter();

  deckSorter.sort();
  if (AUTO_SORT) {
    console.debug('Automatic sort submission enabled');

    return deckSorter.submitSort();
  }
  console.debug('Automatic sort submission disabled');

  deckSorter.attachToDom();
})();
