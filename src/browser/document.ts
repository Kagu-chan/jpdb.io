import { adjacentElement } from './fn/adjacent-element';
import { appendElement } from './fn/append-element';
import { closestElement } from './fn/closest-element';
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

import { _button, _checkbox, _container, _radiobutton, _textarea, _textfield } from './util/index';

interface DOMElementBaseOptions {
  id?: string;
  class?: string | string[];
  attributes?: Record<string, string | boolean>;
  style?: Partial<CSSStyleDeclaration>;
  innerText?: string | number;
  innerHTML?: string;
  handler?: (ev?: MouseEvent) => void;
}

declare global {
  interface Document {
    jpdb: {
      id: number;
      adjacentElement: typeof adjacentElement;
      appendElement: typeof appendElement;
      closestElement: typeof closestElement;
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

    util: {
      button: typeof _button;
      checkbox: typeof _checkbox;
      container: typeof _container;
      radiobutton: typeof _radiobutton;
      textarea: typeof _textarea;
      textfield: typeof _textfield;
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
  closestElement,
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

document.util = {
  button: _button,
  checkbox: _checkbox,
  container: _container,
  radiobutton: _radiobutton,
  textarea: _textarea,
  textfield: _textfield,
};
