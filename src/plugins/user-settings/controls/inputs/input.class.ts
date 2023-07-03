import { DOMElementTagOptions } from '../../../../lib/dom';
import { PluginUserOption } from '../../../../lib/types';

export abstract class Input<TValue> {
  protected _inputOptions: DOMElementTagOptions<'input'>;
  // public onchange: (newValue: TValue) => void;

  // public readonly container: HTMLElement;

  // protected _elements: Map<string, HTMLElement> = new Map();
  // protected _mainElement: TElement;

  // protected _dom: DOMManager = new DOMManager();
  // protected _virtual: boolean = false;

  // public get value(): TValue {
  //   return this._value;
  // }

  // public get key(): string {
  //   return this._mainElement.dataset.key;
  // }

  // public get isVirtual(): boolean {
  //   return this._virtual;
  // }

  constructor(
    public readonly name: string,
    public readonly options: PluginUserOption,
    protected _value: TValue,
  ) {
    // this.container = createElement('div');
    // this._mainElement = this.render();
    // if (this._virtual) return;
    // this._dom.addEventListener(this._mainElement, 'change', (): void => {
    //   if (this.onchange) this.onchange(this.readValue());
    // });
  }

  public abstract getControls(): DOMElementTagOptions<any>[];

  // public setInteractable(key: string, action: PluginUserOptionDependencyAction): void {
  //   this._mainElement.setAttribute('data-interaction-key', key);
  //   this._mainElement.setAttribute('data-interaction-action', action);
  // }

  /**
   * Set this method to retrieve the actual input element. Do not use this method, use `retrieveInput()` instead
   */
  public abstract getInputElement(): DOMElementTagOptions<'input'>;

  public retrieveInput(): DOMElementTagOptions<'input'> {
    if (!this._inputOptions) {
      this._inputOptions = this.getInputElement();
    }

    return this._inputOptions;
  }

  public getValue(): TValue {
    return this.retrieveInput().element.value as TValue;
  }

  public getLabel(): DOMElementTagOptions<'label'> {
    return {
      tag: 'label',
      class: this.options.text ? [] : ['hidden'],
      innerHTML: this.options.text,
      attributes: { for: this.name },
    };
  }

  public getDescription(marginLeft?: string): DOMElementTagOptions<'p'> {
    return {
      tag: 'p',
      class: this.options.description ? [] : ['hidden'],
      innerHTML: this.options.description,
      style: {
        opacity: '.8',
        marginLeft,
      },
    };
  }
}
