import { Input } from './input.class';

export abstract class TextBoxBasedInput<TValue> extends Input<TValue, HTMLInputElement> {
  protected render(): HTMLInputElement {
    this.append('outer', this.container, 'div', { class: ['form-box'] });
    this.append('inner', 'outer', 'div');
    this.renderLabel('inner');

    const input = this.append('input', 'inner', 'input', {
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
    });

    this.renderDescription('inner');

    return input;
  }

  protected abstract getInputAttributes(): Record<string, string | boolean> & {
    name?: undefined;
    placeholder?: undefined;
    'data-key'?: undefined;
  };
}
