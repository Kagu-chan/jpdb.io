import { Root } from '../root';

type DOMElementOptions = {
  id?: string;
  class?: string[];
  attributes?: Record<string, string | boolean>;
  style?: Partial<CSSStyleDeclaration>;
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

  //#region Append
  public appendElement<TTarget extends HTMLElement, TSource extends HTMLElement>(
    target: TTarget,
    source: TSource,
  ): TSource {
    target.append(source);

    return source;
  }

  public prependElement<TTarget extends HTMLElement, TSource extends HTMLElement>(
    target: TTarget,
    source: TSource,
  ): TSource {
    target.prepend(source);

    return source;
  }

  public adjacentElement<TTarget extends HTMLElement, TSource extends HTMLElement>(
    position: InsertPosition,
    target: TTarget,
    source: TSource,
  ): TSource {
    target.insertAdjacentElement(position, source);

    return source;
  }
  //#endregion

  //#region Create
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

      if (value === false) return;
      e.setAttribute(key, value as string);
    });
    Object.keys(options.style ?? {}).forEach((key: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      (e.style as any)[key] = options.style[key as keyof CSSStyleDeclaration];
    });

    e.classList.add(...(options.class ?? []));

    return e;
  }

  public appendNewElement<K extends keyof HTMLElementTagNameMap>(
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    return this.appendElement(target, this.createElement(tagName, options));
  }

  public prependNewElement<K extends keyof HTMLElementTagNameMap>(
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    return this.prependElement(target, this.createElement(tagName, options));
  }

  public adjacentNewElement<K extends keyof HTMLElementTagNameMap>(
    position: InsertPosition,
    target: HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    return this.adjacentElement(position, target, this.createElement(tagName, options));
  }
  //#endregion

  //#region Events
  public addAndRunEventListener(e: HTMLElement, event: string, fn: () => void): void {
    this.addEventListener(e, event, fn);
    fn();
  }

  public addEventListener(e: HTMLElement, event: string, fn: () => void): void {
    e.addEventListener(event, () => fn());
  }
  //#endregion

  //#region Misc
  public toggleHide(e: HTMLElement): void {
    if (e.classList.contains('hidden')) return e.classList.remove('hidden');

    e.classList.add('hidden');
  }

  public hide(e: HTMLElement): void {
    e.classList.add('hidden');
  }

  public show(e: HTMLElement): void {
    e.classList.remove('hidden');
  }

  public hidden(e: HTMLElement, hidden: boolean): void {
    if (hidden) e.classList.add('hidden');
    else e.classList.remove('hidden');
  }
  //#endregion
}
