import { adjacentElement } from './adjacent-element';
import { appendElement } from './append-element';
import { countElements } from './count-elements';
import { createElement } from './create-element';
import { destroyElement } from './destroy-element';
import { findElement } from './find-element';
import { findElements } from './find-elements';
import { hideElement } from './hide-element';
import { prependElement } from './prepend-element';
import { resolveElement } from './resolve-element';
import { showElement } from './show-element';
import { withElement } from './with-element';
import { withElements } from './with-elements';

type DOMElementBaseOptions = {
  id?: string;
  class?: string[];
  attributes?: Record<string, string | boolean>;
  style?: Partial<CSSStyleDeclaration>;
  innerText?: string;
  innerHTML?: string;
  handler?: (ev?: MouseEvent) => void;
};

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

  type DOMElementOptions = DOMElementBaseOptions & {
    children?: (DOMElementTagOptions | HTMLElement)[];
  };

  type DOMElementTagOptions<K extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> =
    DOMElementOptions & {
      tag: K;
    };
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
