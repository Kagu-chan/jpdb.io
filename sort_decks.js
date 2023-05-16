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
  'Mining', //  'Mining' Deck
  /N5/i, //     Deck containing 'N5' (in this case, the JLPT N5 Deck)
  '1K Top Anime Frequency List', // 1K Anime Frequency list
  'Refold', //  'Refold' Deck
];

// Decks to put to the BOTTOM
const BOTTOM_DECKS = [
  /(?<defaut>\d+K Top)/i, //   Frequency Lists
  /- N(?<desc>\d)$/i, //       Decks ending with '- N' plus a number (The other JLPT Decks) - sorted DESC by the given number
  /Club (?<default>\d+):/i, // Decks match 'Club ' + a number + ':' (JPDB Anime Club XX: Title) - sorted by Coverage
  /Mining/i, //                Other Mining Decks
  'Graveyard', //              Decks I dont learn anymore
];

// 'default' decks and all other (non sorted) decks will be sorted by Coverage (if enabled), then by Vocabulary
/**
 * Enabeling this will sort decks first by its Coverage, then Vocabulary.
 * If no coverage is available for a given deck, it will sort by Vocabulary only.
 */
const SORT_BY_COV = true;

// When sorting by Coverage or Vocab, REC (Recognition) will first sort by the targeted value (the one in parentheses), then the actual value (left)
/**
 * Sort by recognition, then by known words.
 * Recognition is the value in parentheses (Words you have already seen, but do not "know" yet)
 *
 * If two decks have the same recognition value, it falls back to known words
 * This priority applies separately for Coverage and Vocab
 */
const SORT_BY_REC = true;

/**
 * Reverses the priority between known words and recognition.
 *
 * If two decks have the same percentage of known words, it will be sorted by recognition as a lower priority (instead of vice versa).
 * Only applies if SORT_BY_REC is true
 */
const SWAP_REC_VOC = true;

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
    this.isSorting = false;

    // Auxiliary data
    this.deckNodes = Array.from(document.querySelectorAll('div.deck')).slice(0, -3);
    this.allDecks = this.deckNodes.map(this.deckNodeToObject.bind(this));
  }

  deckNodeToObject(node, pos) {
    const titleBlock = node.querySelector('.deck-main .deck-title a');
    const title = titleBlock.innerText.replace(/\d+\.\s/, '');
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

    if (this.instructions.length) {
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

    this.isSorting = true;
    this.updateInstructionsText();
    // eslint-disable-next-line no-undef
    xhr('POST', 'https://jpdb.io/change_deck_priority', instruction, () => {
      if (this.instructions.length) {
        setTimeout(() => this.sortDecksRemote(), 100);
      } else {
        console.debug('Trigger refresh of deck list');

        // eslint-disable-next-line no-undef
        virtual_refresh();
        this.isSorting = false;
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
    const priorityList = [];

    if (SORT_BY_COV) {
      if (SORT_BY_REC) {
        priorityList.push(
          ...(SWAP_REC_VOC
            ? [
                [l.ck, r.ck],
                [l.cp, r.cp],
              ]
            : [
                [l.cp, r.cp],
                [l.ck, r.ck],
              ]),
        );
      } else priorityList.push([l.ck, r.ck]);
    }

    if (SORT_BY_REC) {
      priorityList.push(
        ...(SWAP_REC_VOC
          ? [
              [l.vk, r.vk],
              [l.vp, r.vp],
            ]
          : [
              [l.vp, r.vp],
              [l.vk, r.vk],
            ]),
      );
    } else priorityList.push([l.vk, r.vk]);

    while (priorityList.length) {
      const [lv, rv] = priorityList.shift();
      if (lv !== rv) return comp(lv, rv);
    }

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

  updateInstructionsText() {
    let text = this.isSorting
      ? `Sending instructions... ${this.instructions.length} left`
      : `Sort Decks (${this.instructions.length})`;

    document.getElementById('sort-decks').innerHTML = text;
  }

  attachToDom() {
    if (!this.instructions.length) return;

    console.debug('Add clickable object to deck controls');
    const menu = document.querySelector('body > div.container.bugfix > div:nth-child(2)');
    const newEl = `<a style="flex-grow: 1;" class="outline" id="sort-decks" href="javascript:sortDecks()">Sort Decks</a>`;

    window.sortDecks = this.submitSort.bind(this);
    menu.innerHTML = `${menu.innerHTML}${newEl}`;

    this.updateInstructionsText();
  }
}

(function () {
  'use strict';

  const deckSorter = new DeckSorter();

  deckSorter.sort();
  deckSorter.attachToDom();
})();
