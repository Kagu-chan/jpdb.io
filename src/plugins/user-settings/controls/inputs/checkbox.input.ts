import { Input } from './input.class';

export class CheckBoxInput extends Input<boolean, HTMLInputElement> {
  protected render(): HTMLInputElement {
    this.append('outer', this.container, 'div', { class: ['checkbox'] });

    const input = this.append('input', 'outer', 'input', {
      id: this.name,
      attributes: {
        name: this.name,
        type: 'checkbox',
        'data-key': this.options.key,
      },
    });

    this.renderLabel('outer');
    this.renderDescription(this.container, '2rem');

    input.checked = this.value;

    return input;
  }

  protected readValue(): boolean {
    return this._mainElement.checked;
  }
}
