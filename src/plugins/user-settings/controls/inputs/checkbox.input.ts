import { DOMElementTagOptions } from '../../../../lib/dom';
import { Input } from './input.class';

export class CheckBoxInput extends Input<boolean> {
  public getControls(): DOMElementTagOptions<any>[] {
    return [
      {
        tag: 'div',
        class: ['checkbox'],
        children: [this.retrieveInput(), this.getLabel()],
      },
      this.getDescription('2rem'),
    ];
  }

  public getInputElement(): DOMElementTagOptions<'input'> {
    return {
      tag: 'input',
      id: this.name,
      attributes: {
        name: this.name,
        type: 'checkbox',
        'data-key': this.options.key,
      },
      afterrender: (input: HTMLInputElement): void => {
        input.checked = this._value;
      },
    };
  }

  public getValue(): boolean {
    return this.retrieveInput().element.checked;
  }
}
