// ==UserScript==
// @name         JPDB.io Hide Deck numbers
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hide Deck numbers from JPDB.io
// @author       Kagu-chan
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

const JPDB = window.JPDBScriptRunner;
const { Deck, Script, actions } = JPDB;

JPDB.add(
  class HideDeckNumbers extends Script('/learn', '/deck-list') {
    run() {
      Deck.getDecks().forEach((deck) => (deck.titleNode.innerText = deck.title));

      return true;
    }
  },
);
