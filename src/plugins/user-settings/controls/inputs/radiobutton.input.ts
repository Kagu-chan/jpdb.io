import { PluginUserOptionRadioButton } from '../../../../lib/types';
import { Input } from './input.class';

export class RadioButtonInput extends Input<string, HTMLInputElement> {
  protected render(): HTMLInputElement {
    this.append('outer', this.container, 'div', {
      style: {
        marginLeft: '1rem',
      },
    });

    const options = this.options as PluginUserOptionRadioButton;
    const input = this.append('input', this.container, 'input', {
      id: this.name,
      attributes: {
        name: this.name,
        type: 'text',
        value: this.value,
        'data-key': this.options.key,
        disabled: true,
      },
      class: ['hidden'],
    });

    Object.values(options.options).forEach((value: string) => {
      this.append(`cb-${value}`, 'outer', 'div', { class: ['checkbox'] });

      const currentInput = this.append(`ip-${value}`, `cb-${value}`, 'input', {
        id: `${this.name}-${value}`,
        attributes: {
          name: this.name,
          value,
          type: 'radio',
        },
      });

      this.append(`lb-${value}`, `cb-${value}`, 'label', {
        innerText: options.labels[value as keyof typeof options.labels],
        attributes: {
          for: `${this.name}-${value}`,
        },
      });

      if (this.value === value) {
        currentInput.checked = true;
      }

      currentInput.addEventListener('change', () => {
        this._mainElement.value = currentInput.value;
        this._mainElement.dispatchEvent(new Event('change'));
      });
    });

    return input;
  }
}
