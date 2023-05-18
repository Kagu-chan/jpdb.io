// ==UserScript==
// @name         JPDB.io Deck Mover
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Mark decks for later by !moving them to specific decks
// @author       Kagu-chan
// @match        https://jpdb.io/deck?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jpdb.io
// @grant        none
// ==/UserScript==

const MOVE_OPTIONS = [
  {
    target: 180,
    title: 'Mining',
  },
  {
    target: 291,
    title: '>10K',
  },
];

(function () {
  'use strict';

  const queryToObject = (query) => {
    const payload = {};
    query
      .replace('?', '')
      .split('&')
      .forEach((c) => {
        const [key, val] = c.split('=');

        payload[key] = val;
      });

    return payload;
  };

  const currentDeckId = Number(queryToObject(window.location.search).id);

  window.moveToDeck = (qData, target) => {
    const payload = queryToObject(qData);

    const addUrl = `https://jpdb.io/deck/${target}/add`;
    const remUrl = `https://jpdb.io/deck/${currentDeckId}/remove-from-deck`;
    const m = 'POST';
    const send = {
      v: Number(payload.v),
      s: Number(payload.s),
      origin: `/deck?id=${currentDeckId}`,
    };

    document.addEventListener('virtual-refresh', () => init(), { once: true });
    // eslint-disable-next-line no-undef
    xhr(m, addUrl, send, () => xhr(m, remUrl, payload, () => virtual_refresh()));
  };

  const init = () => {
    Array.from(
      document.querySelectorAll('.vocabulary-list .dropdown .dropdown-content>ul'),
    ).forEach((node) => {
      const cn = Array.from(node.childNodes);
      const targetNode = cn.find(({ childNodes }) => childNodes[0].innerHTML?.startsWith('Edit'));
      const deckSelectionQuery = cn
        .find(({ childNodes }) => childNodes[0].innerHTML === 'Add to a deck')
        .childNodes[0]?.href?.split('?')[1];

      if (!targetNode) return;

      MOVE_OPTIONS.filter(({ target: id }) => id !== currentDeckId).forEach(({ target, title }) => {
        targetNode.innerHTML = `<li><a href="javascript:moveToDeck('${deckSelectionQuery}', ${target})">Move to: ${title}</a></li>${targetNode.innerHTML}`;
      });
    });
  };

  init();

  setTimeout(console.log(window));
})();
