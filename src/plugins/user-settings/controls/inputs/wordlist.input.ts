import { Input } from './input.class';

export class WordListInput extends Input<string[], HTMLInputElement> {
  private _workingValue: string[];

  private _innerContainer: HTMLDivElement;
  private _inputs: HTMLDivElement | HTMLLabelElement;
  private _inputCollection: HTMLInputElement[];
  private _controls: HTMLDivElement;

  private _add: HTMLInputElement;

  protected render(): HTMLInputElement {
    this._workingValue = [...this.value];

    const hiddenInput = this.append('input', this.container, 'input', {
      id: this.name,
      attributes: {
        name: this.name,
        type: 'text',
        value: JSON.stringify(this.value),
        'data-key': this.options.key,
        disabled: true,
      },
      class: ['hidden'],
    });

    this.renderMainContainer();
    this.renderInputsContainer();
    this.renderContents(false);

    this.renderControls();
    this.renderDescription(this._innerContainer);

    return hiddenInput;
  }

  protected readValue(): string[] {
    return this._value;
  }

  private renderMainContainer(): void {
    const details = this.append('root', this.container, 'details', {
      class: ['accordion', 'user-settings'],
    });

    this.append('label', details, 'summary', {
      innerText: this.options.text,
    });

    this._innerContainer = this.append('inner', details, 'div', { class: ['word-list'] });
  }

  private renderInputsContainer(): void {
    this._inputs = this.append('inputs', this._innerContainer, 'div', { class: ['input-list'] });
  }

  private renderControls(): void {
    this._controls = this.append('controls', this._innerContainer, 'div', {
      class: ['controls-list'],
    });

    this._add = this.append('add', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Add' },
      class: ['outline'],
      handler: (e) => {
        e.preventDefault();

        this._workingValue.push('');
        this.rerenderContents();
      },
    });

    this.append('update', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Update' },
      class: ['outline', 'v4'],
      handler: (e) => {
        e.preventDefault();

        this._value = [...this._workingValue];
        this._mainElement.value = JSON.stringify(this.value);

        this._mainElement.dispatchEvent(new Event('change'));
      },
    });

    this.append('remove', this._controls, 'input', {
      attributes: { type: 'submit', value: 'Reset' },
      class: ['outline', 'v3'],
      handler: (e) => {
        e.preventDefault();

        this._workingValue = [...this.value];
        this.rerenderContents();
      },
    });
  }

  private renderContents(focusLatest: boolean): void {
    this._inputCollection = [];

    this._workingValue.forEach((v: string, id: number) => {
      const last = id === this._workingValue.length - 1;

      const c = this._dom.appendNewElement(this._inputs, 'div');
      const i = this._dom.appendNewElement(c, 'input', {
        id: `${this.name}-${id}`,
        attributes: {
          name: `${this.name}-${id}`,
          value: v,
          type: 'text',
        },
      });

      this._dom.appendNewElement(c, 'input', {
        id: `${this.name}-${id}-rem`,
        attributes: {
          type: 'submit',
          value: '-',
        },
        class: ['outline', 'v1'],
        handler: (e) => {
          e.preventDefault();

          this._workingValue.splice(id, 1);
          this.rerenderContents();
        },
      });

      this._inputCollection.push(i);

      if (focusLatest && last) i.focus();

      i.addEventListener('change', () => (this._workingValue[id] = i.value));
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

          this.rerenderContents();
        }
      });
    });
  }

  private rerenderContents(): void {
    this._inputs.replaceChildren();

    this.renderContents(true);
  }
}
