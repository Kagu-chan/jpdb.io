import { Root } from '../root';

type DOMElementOptions = {
  id?: string;
  class?: string[];
  attributes?: Record<string, string>;
  innerText?: string;
  handler?: () => void;
};

export class DOMManager extends Root {
  //#region Selectors
  public find(selector: string): HTMLElement[];
  public find<K extends keyof HTMLElementTagNameMap>(
    selector: string,
    resultTag: K,
  ): HTMLElementTagNameMap[K][];
  public find(selector: string, _?: string): HTMLElement[] {
    return Array.from(document.querySelectorAll(selector));
  }

  public filter(
    selector: string,
    filterFn: (e: HTMLElement, index: number) => boolean,
  ): HTMLElement[];
  public filter<K extends keyof HTMLElementTagNameMap>(
    selector: string,
    filterFn: (e: HTMLElementTagNameMap[K], index: number) => boolean,
    resultTag: K,
  ): HTMLElementTagNameMap[K][];
  public filter(
    selector: string,
    filterFn: (e: HTMLElement, index: number) => boolean,
    _?: string,
  ): HTMLElement[] {
    return this.find(selector).filter(filterFn);
  }

  public findOne(selector: string): HTMLElement;
  public findOne<K extends keyof HTMLElementTagNameMap>(
    selector: string,
    tagName: K,
  ): HTMLElementTagNameMap[K];
  public findOne(selector: string, _?: string): HTMLElement {
    return document.querySelector(selector);
  }

  public filterOne(
    selector: string,
    filterFn: (e: HTMLElement, index: number) => boolean,
  ): HTMLElement;
  public filterOne<K extends keyof HTMLElementTagNameMap>(
    selector: string,
    filterFn: (e: HTMLElementTagNameMap[K], index: number) => boolean,
    resultTag: K,
  ): HTMLElementTagNameMap[K];
  public filterOne(
    selector: string,
    filterFn: (e: HTMLElement, index: number) => boolean,
    _?: string,
  ): HTMLElement {
    return this.find(selector).filter(filterFn)[0];
  }
  //#endregion

  //#region Creation
  public createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = document.createElement(tagName);

    if (options.id) e.setAttribute('id', options.id);
    if (options.innerText) e.innerText = options.innerText;
    if (options.handler) e.onclick = options.handler;

    Object.keys(options.attributes ?? {}).forEach((key: string) => {
      const value = options.attributes[key];

      e.setAttribute(key, value);
    });
    e.classList.add(...(options.class ?? []));

    return e;
  }

  public appendNewElement<K extends keyof HTMLElementTagNameMap>(
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this.createElement(tagName, options);

    target.append(e);
    return e;
  }

  public prependNewElement<K extends keyof HTMLElementTagNameMap>(
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this.createElement(tagName, options);

    target.prepend(e);
    return e;
  }

  public adjacentNewElement<K extends keyof HTMLElementTagNameMap>(
    position: InsertPosition,
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this.createElement(tagName, options);

    target.insertAdjacentElement(position, e);
    return e;
  }
  //#endregion
}
