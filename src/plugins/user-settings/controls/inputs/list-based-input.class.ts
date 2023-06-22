import { Input } from './input.class';

export abstract class ListBasedInput<TListType> extends Input<TListType[], HTMLInputElement> {
  protected _workingValue: TListType[];

  protected _innerContainer: HTMLDivElement;
  protected _inputs: HTMLDivElement;
  protected _inputCollection: HTMLInputElement[];
  protected _controls: HTMLDivElement;

  protected _add: HTMLInputElement;

  protected render(): HTMLInputElement {
    this._workingValue = [...this.value];

    const hiddenInput = this.append('input', this.container, 'input', {
      id: this.name,
      attributes: {
        name: this.name,
        type: 'text',
        value: this.itemsToString(this.value),
        'data-key': this.options.key,
        disabled: true,
      },
      class: ['hidden'],
    });

    this.renderMainContainer();
    this.renderInputHeader(this._innerContainer);
    this.renderInputsContainer();
    this.renderInputList(false);

    this.renderControls();
    this.renderDescription(this._innerContainer);

    return hiddenInput;
  }

  protected abstract getItemListClass(): string;
  protected abstract openOnStart(): boolean;

  protected abstract getEmptyItem(): TListType;

  protected abstract stringToItem(val: string): TListType;
  protected abstract itemToString(val: TListType): string;

  protected abstract stringToItems(val: string): TListType[];
  protected abstract itemsToString(val: TListType[]): string;

  protected abstract renderInputItem(
    target: HTMLElement,
    value: TListType,
    id: number,
  ): HTMLInputElement;

  protected readValue(): TListType[] {
    return this._value;
  }

  protected renderMainContainer(): void {
    const details = this.append('root', this.container, 'details', {
      class: ['accordion', 'user-settings'],
    });

    if (this.openOnStart()) details.setAttribute('open', '');

    this.append('label', details, 'summary', {
      innerText: this.options.text,
    });

    this._innerContainer = this.append('inner', details, 'div', {
      class: [this.getItemListClass()],
    });
  }

  protected renderInputsContainer(): void {
    this._inputs = this.append('inputs', this._innerContainer, 'div', { class: ['input-list'] });
  }

  protected renderInputHeader(target: HTMLDivElement): void {
    const div = this._dom.createElement('div', {
      class: ['input-list', 'input-header'],
      style: {
        display: 'flex',
        flexFlow: 'row nowrap',
        placeContent: 'space-between',
        alignItems: 'flex-start',
      },
    });

    this.renderInputHeaderContent(div);

    if (div.innerHTML === '') return;

    /**
     * Append some fake items to this container
     *
     * This is to realign the flex items inside this container
     * It is the same HTML as the input controls, so it gains the same box sizing
     */
    this._dom.appendNewElement(div, 'div', {
      innerHTML: [
        // eslint-disable-next-line max-len
        '<div class="deck-sidebar"><input type="submit" value="⮝" class="arrow-control up" disabled><input type="submit" value="⮟" class="arrow-control down" disabled></div>',
        // eslint-disable-next-line max-len
        '<input id="user-settings-CustomLinksPlugin-top-links-0-rem" type="submit" value="-" class="outline v1" disabled>',
      ].join(''),
      style: { opacity: '0' },
    });

    this._dom.appendElement(target, div);
  }

  protected renderInputHeaderContent(_target: HTMLDivElement): void {
    return;
  }

  protected renderControls(): void {
    this._controls = this.append('controls', this._innerContainer, 'div', {
      class: ['controls-list'],
    });

    this._add = this.append('add', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Add' },
      class: ['outline'],
      handler: (e) => {
        e.preventDefault();

        this._workingValue.push(this.getEmptyItem());
        this.refresh();
      },
    });

    this.append('update', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Update' },
      class: ['outline', 'v4'],
      handler: (e) => {
        e.preventDefault();

        this._value = [...this._workingValue];
        this._mainElement.value = this.itemsToString(this.value);

        this._mainElement.dispatchEvent(new Event('change'));
      },
    });

    this.append('remove', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Reset' },
      class: ['outline', 'v3'],
      handler: (e) => {
        e.preventDefault();

        this._workingValue = [...this.value];
        this.refresh();
      },
    });
  }

  protected renderInputList(focusLatest: boolean): void {
    this._inputCollection = [];

    this._workingValue.forEach((v: TListType, id: number) => {
      const last = id === this._workingValue.length - 1;

      const c = this._dom.appendNewElement(this._inputs, 'div', { class: ['input-item'] });
      const i = this.renderInputItem(c, v, id);

      this.addItemControls(c, id);
      this._inputCollection.push(i);

      if (focusLatest && last) i.focus();

      i.addEventListener('change', () => (this._workingValue[id] = this.stringToItem(i.value)));
      i.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();

          if (last) {
            return this._add.click();
          }

          this._inputCollection[id + 1].focus();
        }
      });

      i.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && i.value === '') {
          e.preventDefault();

          this._workingValue.splice(id, 1);

          this.refresh();
        }
      });
    });
  }

  protected refresh(): void {
    this._inputs.replaceChildren();

    this.renderInputList(true);
  }

  protected swapPositions(index1: number, index2: number): void {
    const tmp = this._workingValue[index1];
    this._workingValue[index1] = this._workingValue[index2];
    this._workingValue[index2] = tmp;
  }

  protected addItemControls(container: HTMLDivElement, id: number): void {
    const sideBar = this._dom.appendNewElement(container, 'div', {
      class: ['deck-sidebar'],
    });

    const up = this._dom.appendNewElement(sideBar, 'input', {
      class: ['arrow-control', 'up'],
      attributes: { type: 'submit', value: '⮝' },
      handler: (ev) => {
        ev.preventDefault();

        this.swapPositions(id, id - 1);
        this.refresh();
      },
    });
    const down = this._dom.appendNewElement(sideBar, 'input', {
      class: ['arrow-control', 'down'],
      attributes: { type: 'submit', value: '⮟' },
      handler: (ev) => {
        ev.preventDefault();

        this.swapPositions(id, id + 1);
        this.refresh();
      },
    });

    if (id === 0) up.setAttribute('disabled', '');
    if (id === this._workingValue.length - 1) down.setAttribute('disabled', '');

    this._dom.appendNewElement(container, 'input', {
      id: `${this.name}-${id}-rem`,
      attributes: {
        type: 'submit',
        value: '-',
      },
      class: ['outline', 'v1'],
      handler: (e) => {
        e.preventDefault();

        this._workingValue.splice(id, 1);
        this.refresh();
      },
    });
  }
}
