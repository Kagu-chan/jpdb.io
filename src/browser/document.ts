import { adjacentElement } from './fn/adjacent-element';
import { appendElement } from './fn/append-element';
import { countElements } from './fn/count-elements';
import { createElement } from './fn/create-element';
import { destroyElement } from './fn/destroy-element';
import { findElement } from './fn/find-element';
import { findElements } from './fn/find-elements';
import { hideElement } from './fn/hide-element';
import { prependElement } from './fn/prepend-element';
import { resolveElement } from './fn/resolve-element';
import { showElement } from './fn/show-element';
import { textFromNode } from './fn/text-from-node';
import { withElement } from './fn/with-element';
import { withElements } from './fn/with-elements';

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
      textFromNode: typeof textFromNode;
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
  textFromNode,
  withElement,
  withElements,
};
