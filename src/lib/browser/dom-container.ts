import { DOMManager } from './dom-manager';

export abstract class DOMContainer extends DOMManager {
  public dom: HTMLDivElement;
  public headingElement?: HTMLElement;

  constructor(
    protected _id: string,
    protected _heading?: string,
    protected _headingType?: keyof HTMLElementTagNameMap,
  ) {
    super();
  }

  public destroy(): void {
    this.dom.remove();
    this.dom = undefined;
  }

  public render(): void {
    this.dom = this.createElement('div', {
      id: this._id,
    });

    if (this._heading) {
      this.headingElement = this.appendNewElement(this.dom, this._headingType ?? 'div', {
        innerText: this._heading,
      });
    }

    this.attachToDom(this.dom);
  }

  protected addRemDiv(): void {
    this.appendNewElement(this.dom, 'div', {
      style: {
        paddingBottom: '1rem',
      },
    });
  }

  protected abstract attachToDom(element: HTMLDivElement): void;
}
