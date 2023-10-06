import { DOMElementOptions, DOMManager } from '../../../../dom-manager';
import {
  PluginUserOption,
  PluginUserOptionDependencyAction,
} from '../../../../plugin/types/plugin-user-options';

export abstract class Input<TValue, TElement extends HTMLElement> {
  public onchange: (newValue: TValue) => void;

  protected _elements = new Map<string, HTMLElement>();
  protected _mainElement: TElement;

  protected _dom: DOMManager = new DOMManager();
  protected _virtual: boolean = false;

  public get value(): TValue {
    return this._value;
  }

  public get key(): string {
    return this._mainElement.dataset.key;
  }

  public get isVirtual(): boolean {
    return this._virtual;
  }

  constructor(
    public readonly container: HTMLElement,
    public readonly name: string,
    public readonly options: PluginUserOption,
    protected _value: TValue,
  ) {
    this._mainElement = this.render();

    if (this._virtual) {
      return;
    }

    this._dom.addEventListener(this._mainElement, 'change', (): void => {
      if (this.onchange) {
        this.onchange(this.readValue());
      }
    });
  }

  public setInteractable(key: string, action: PluginUserOptionDependencyAction): void {
    this._mainElement.setAttribute('data-interaction-key', key);
    this._mainElement.setAttribute('data-interaction-action', action);
  }

  public renderLabel(target: string | HTMLElement): HTMLLabelElement {
    if (this.options.text?.length) {
      return this.append('label', target, 'label', {
        innerHTML: this.options.text,
        attributes: { for: this.name },
      });
    }
  }

  public renderDescription(
    target: string | HTMLElement,
    marginLeft?: string,
  ): HTMLParagraphElement {
    if (this.options.description?.length) {
      return this.append('description', target, 'p', {
        innerHTML: this.options.description,
        style: {
          opacity: '.8',
          marginLeft,
        },
      });
    }
  }

  //#region Element Creation
  public create<K extends keyof HTMLElementTagNameMap>(
    key: string,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this._dom.createElement(tagName, options);

    this._elements.set(key, e);

    return e;
  }

  public append<K extends keyof HTMLElementTagNameMap>(
    key: string,
    target: HTMLElement | string,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this._dom.appendNewElement(
      typeof target === 'string' ? this._elements.get(target) : target,
      tagName,
      options,
    );

    this._elements.set(key, e);

    return e;
  }

  public prepend<K extends keyof HTMLElementTagNameMap>(
    key: string,
    target: HTMLElement | string,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this._dom.prependNewElement(
      typeof target === 'string' ? this._elements.get(target) : target,
      tagName,
      options,
    );

    this._elements.set(key, e);

    return e;
  }

  public adjacent<K extends keyof HTMLElementTagNameMap>(
    key: string,
    position: InsertPosition,
    target: string | HTMLElement,
    tagName: K,
    options: DOMElementOptions = {},
  ): HTMLElementTagNameMap[K] {
    const e = this._dom.adjacentNewElement(
      position,
      typeof target === 'string' ? this._elements.get(target) : target,
      tagName,
      options,
    );

    this._elements.set(key, e);

    return e;
  }
  //#endregion

  protected readValue(): TValue {
    if (!('value' in this._mainElement)) {
      throw new Error('readValue must be overwritten');
    }

    return this._mainElement.value as TValue;
  }

  protected abstract render(): TElement;
}
