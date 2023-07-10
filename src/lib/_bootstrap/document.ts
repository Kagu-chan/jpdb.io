import { adjacentElement } from '../_dom/adjacent-element';
import { appendElement } from '../_dom/append-element';
import { countElements } from '../_dom/count-elements';
import { createElement } from '../_dom/create-element';
import { destroyElement } from '../_dom/destroy-element';
import { findElement } from '../_dom/find-element';
import { findElements } from '../_dom/find-elements';
import { hideElement } from '../_dom/hide-element';
import { prependElement } from '../_dom/prepend-element';
import { resolveElement } from '../_dom/resolve-element';
import { showElement } from '../_dom/show-element';
import { withElement } from '../_dom/with-element';
import { withElements } from '../_dom/with-elements';

export {};

declare global {
  interface Document {
    jpdb: {
      id: number;
      adjacentElement: typeof adjacentElement;
      appendElement: typeof appendElement;
      countElements: typeof countElements;
      createElement: typeof createElement;
      destroyElement: typeof destroyElement;
      findElement: typeof findElement;
      findElements: typeof findElements;
      hideElement: typeof hideElement;
      prependElement: typeof prependElement;
      resolveElement: typeof resolveElement;
      showElement: typeof showElement;
      withElement: typeof withElement;
      withElements: typeof withElements;
    };
  }
}

document.jpdb = {
  id: 0,
  adjacentElement,
  appendElement,
  countElements,
  createElement,
  destroyElement,
  findElement,
  findElements,
  hideElement,
  prependElement,
  resolveElement,
  showElement,
  withElement,
  withElements,
};
