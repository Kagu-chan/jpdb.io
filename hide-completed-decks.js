// ==UserScript==
// @name         JPDB.io Hide completed Decks
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Hide completed Decks from JPDB.io
// @author       Kagu-chan
// @match        https://jpdb.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

const JPDB = window.JPDBScriptRunner;
const { Deck, Script, Node, actions } = JPDB;

JPDB.add(class HideCompletedDecks extends Script('/learn', '/deck-list') {
    style = 'opacity: .5;margin-left:12px;font-size: small;cursor: pointer;';

    get text() {
        const { length: l } = this.hides;
        const deckText = l > 1 ? 'decks' : 'deck';

        return this.show ? `Hide ${l} completed ${deckText}` : `Show ${l} completed ${deckText}`;
    }

    constructor() {
        super();

        this.hides = [];
        this.show = true;
    }

    run() {
        this.hides = Deck.getDecks().filter((deck) => {
            const rec = deck.getRecognition();

            return rec >= 100;
        }).map(({ node }) => node);

        this.action = actions.scope('yourDecks').add('hide-completed', this.text, (action) => {
            Node[this.show ? 'hide' : 'display'](...this.hides);
            this.show = !this.show;

            action.update({ text: this.text });
        }).run().show();

        return true;
    }
});
