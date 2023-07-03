import { DOMElementTagOptions } from '../../../../lib/dom';
import { Input } from './input.class';

export abstract class TextBoxBasedInput<TValue> extends Input<TValue> {
  public getInputElement(): DOMElementTagOptions<'input'> {
    return {
      tag: 'input',
      id: this.name,
      attributes: {
        name: this.name,
        placeholder: this.options.text?.length ? this.options.text : '',
        'data-key': this.options.key,
        ...this.getInputAttributes(),
      },
      style: {
        maxWidth: '16rem',
      },
    };
  }
  // protected render(): HTMLInputElement {
  //   this.append('outer', this.container, 'div', { class: ['form-box'] });
  //   this.append('inner', 'outer', 'div');
  //   this.renderLabel('inner');

  //   const input = this.append('input', 'inner', 'input', {
  //     id: this.name,
  //     attributes: {
  //       name: this.name,
  //       placeholder: this.options.text?.length ? this.options.text : '',
  //       'data-key': this.options.key,
  //       ...this.getInputAttributes(),
  //     },
  //     style: {
  //       maxWidth: '16rem',
  //     },
  //   });

  //   this.renderDescription('inner');

  //   return input;
  // }

  public getControls(): DOMElementTagOptions<any>[] {
    return [
      {
        tag: 'div',
        class: ['form-box'],
        children: [this.getLabel(), this.retrieveInput(), this.getDescription()],
      },
    ];
  }

  protected abstract getInputAttributes(): Record<string, string | boolean> & {
    name?: undefined;
    placeholder?: undefined;
    'data-key'?: undefined;
  };
}
