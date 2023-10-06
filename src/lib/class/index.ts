import { Deck as _Deck } from './deck';

declare global {
  interface Window {
    Deck: typeof _Deck;
  }

  class Deck extends _Deck {}
}

window.Deck = _Deck;
