import { ModuleUserOption } from '../../../module-options.type';
import { Renderer } from './_renderer';

export abstract class ListRenderer<
  TOption extends ModuleUserOption = ModuleUserOption,
  TVal = unknown,
> extends Renderer<TOption, TVal[]> {
  protected _workingValue: TVal[];

  /**
   * The main input element containing the composed data
   */
  protected _input: HTMLInputElement;

  /**
   * The main inputs container (user interactable)
   */
  protected _inputs: HTMLDivElement;

  /**
   * The actual managed inputs
   */
  protected _inputCollection: HTMLInputElement[];

  /**
   * The accirdion where all input data resides
   */
  protected _accordion: HTMLDetailsElement;

  /**
   * The main panel containing all interactable data
   */
  protected _accordionPanel: HTMLDivElement;

  /**
   * Button to add a new value
   */
  protected _add: HTMLInputElement;

  public render(container: HTMLDivElement): void {
    this._workingValue = [...this._getValue()];
    this._accordionPanel = document.util.container([], { class: this.getItemListClass() });

    document.util.appendHelpText(this._accordionPanel, this._options.description);

    this.createMainInput();
    this.createAccordion();
    this.createInputList();
    this.createControls();

    document.jpdb.appendElement(container, document.util.container([this._input, this._accordion]));
  }

  protected abstract getItemListClass(): string;
  protected abstract getSingleInputRow(
    value: TVal,
    id: number,
    container: HTMLDivElement,
  ): HTMLInputElement;

  protected abstract getEmptyItem(): TVal;

  protected abstract stringToItem(val: string): TVal;
  protected abstract itemToString(val: TVal): string;

  protected abstract stringToItems(val: string): TVal[];
  protected abstract itemsToString(val: TVal[]): string;

  protected swapPositions(index1: number, index2: number): void {
    const tmp = this._workingValue[index1];

    this._workingValue[index1] = this._workingValue[index2];
    this._workingValue[index2] = tmp;
  }

  protected refresh(): void {
    this._inputs.replaceChildren();

    this.renderInputList(!isMobile() && true);
  }

  //#region Main Input
  protected createMainInput(): void {
    this._input = document.jpdb.createElement('input', {
      attributes: {
        name: this._options.key,
        type: 'text',
        value: this.itemsToString(this._getValue()),
        'data-key': this._options.key,
        disabled: true,
      },
      class: 'hidden',
    });

    this._input.onchange = (): void => this._setValue(JSON.parse(this._input.value) as TVal[]);
  }
  //#endregion

  //#region Accordion shell
  protected createAccordion(): void {
    const stateKey: string = `collapsible-${this._options.key}`;

    this._accordion = document.util.collapsible([this._accordionPanel], {
      text: this._options.text!,
      open: jpdb.state.readState(stateKey, false),
    });

    this._accordion.addEventListener('toggle', () => {
      jpdb.state.writeState(stateKey, this._accordion.open);
    });
  }
  //#endregion

  //#region Input
  protected createInputList(): void {
    this._inputs = document.util.container([], { class: 'input-list' });

    document.jpdb.appendElement(this._accordionPanel, this._inputs);

    this.renderInputList(false);
  }

  protected renderInputList(focusLatest: boolean): void {
    this._inputCollection = [];

    this._workingValue.forEach((v: TVal, id: number) => {
      const last = id === this._workingValue.length - 1;

      const itemContainer = document.jpdb.appendElement(this._inputs, {
        tag: 'div',
        class: 'input-item',
      });
      const itemInput = document.jpdb.appendElement(
        itemContainer,
        this.getSingleInputRow(v, id, itemContainer),
      );

      document.jpdb.appendElement(itemContainer, this.getItemControls(id));
      this._inputCollection.push(itemInput);

      if (focusLatest && last) {
        itemInput.focus();
      }

      itemInput.addEventListener(
        'change',
        () => (this._workingValue[id] = this.stringToItem(itemInput.value)),
      );

      itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          if (last) {
            return this._add.click();
          }

          this._inputCollection[id + 1].focus();
        }
      });

      itemInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && itemInput.value === '') {
          e.preventDefault();

          this._workingValue.splice(id, 1);

          this.refresh();
        }
      });
    });
  }

  protected getItemControls(id: number): HTMLDivElement {
    const up = document.jpdb.createElement({
      tag: 'input',
      class: ['arrow-control', 'up'],
      attributes: {
        type: 'submit',
        value: '⮝',
      },
      handler: (e): void => {
        e?.preventDefault();

        this.swapPositions(id, id - 1);
        this.refresh();
      },
    });
    const down = document.jpdb.createElement({
      tag: 'input',
      class: ['arrow-control', 'down'],
      attributes: {
        type: 'submit',
        value: '⮟',
      },
      handler: (e): void => {
        e?.preventDefault();

        this.swapPositions(id, id + 1);
        this.refresh();
      },
    });

    if (id === 0) {
      up.setAttribute('disabled', '');
    }

    if (id === this._workingValue.length - 1) {
      down.setAttribute('disabled', '');
    }

    return document.jpdb.createElement({
      tag: 'div',
      class: 'side-controls',
      children: [
        {
          tag: 'div',
          class: 'deck-sidebar',
          children: [up, down],
        },
        {
          tag: 'input',
          id: `${this._options.key}-${id}-rem`,
          attributes: {
            type: 'submit',
            value: '-',
          },
          class: ['outline', 'v1'],
          handler: (e): void => {
            e?.preventDefault();

            this._workingValue.splice(id, 1);
            this.refresh();
          },
        },
      ],
    });
  }
  //#endregion

  //#region Controls

  protected createControls(): void {
    this._add = document.jpdb.createElement({
      tag: 'input',
      attributes: { type: 'submit', value: 'Add' },
      class: ['outline'],
      handler: (e): void => {
        e?.preventDefault();

        this._workingValue.push(this.getEmptyItem());
        this.refresh();
      },
    });

    document.jpdb.appendElement(this._accordionPanel, {
      tag: 'div',
      class: 'controls-list',
      children: [
        this._add,
        {
          tag: 'input',
          attributes: { type: 'submit', value: 'Update' },
          class: ['outline', 'v4'],
          handler: (e): void => {
            e?.preventDefault();

            const clone = [...this._workingValue];

            this._setValue(clone);

            this._input.value = this.itemsToString(clone);
          },
        },
        {
          tag: 'input',
          attributes: { type: 'submit', value: 'Reset' },
          class: ['outline', 'v3'],
          handler: (e): void => {
            e?.preventDefault();

            this._workingValue = [...this._getValue()];
            this.refresh();
          },
        },
        {
          tag: 'input',
          attributes: { type: 'submit', value: 'Restore defaults' },
          class: ['outline', 'v1'],
          handler: (e): void => {
            e?.preventDefault();

            const clone = [...(this._options.default as TVal[])];

            this._setValue(clone);

            this._input.value = this.itemsToString(clone);
            this._workingValue = [...this._getValue()];

            this.refresh();
          },
        },
      ],
    });
  }

  //#endregion
}
